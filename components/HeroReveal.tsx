'use client';

import { useEffect, useRef } from 'react';
import { readProjectReturnSlug } from '@/lib/projectReturn';

const DESKTOP_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 901px) and (prefers-reduced-motion: no-preference)';
const FIELD_SIZE = 512;
const ACTIVE_TAIL_MS = 2700;
const MAX_SPLATS_PER_FRAME = 72;

type Splat = {
  density: number;
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
};

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SPLAT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_field;
uniform vec2 u_point;
uniform vec2 u_velocity;
uniform float u_density;
uniform float u_radius;
uniform float u_aspect;

in vec2 v_uv;
out vec4 out_color;

void main() {
  vec4 field = texture(u_field, v_uv);
  vec2 delta = v_uv - u_point;
  delta.x *= u_aspect;
  float bottomResistance = smoothstep(0.0, 0.12, v_uv.y);
  float influence = exp(-dot(delta, delta) / max(u_radius, 0.00001)) * bottomResistance;

  float density = min(3.16, field.r + influence * u_density);
  vec2 velocity = clamp(field.gb + influence * u_velocity, vec2(-2.2), vec2(2.2));
  out_color = vec4(density, velocity, 1.0);
}
`;

const SIMULATION_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_field;
uniform vec2 u_texel;
uniform float u_dt;
uniform float u_time;
uniform float u_aspect;

in vec2 v_uv;
out vec4 out_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + 7.17;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec4 current = texture(u_field, v_uv);
  vec2 velocity = current.gb;
  float bottomResistance = smoothstep(0.0, 0.14, v_uv.y);
  if (velocity.y < 0.0) velocity.y *= bottomResistance;
  vec2 advectedUv = clamp(v_uv - velocity * u_dt * 0.34, vec2(0.001), vec2(0.999));
  vec4 advected = texture(u_field, advectedUv);

  float n = fbm(vec2(v_uv.x * u_aspect, v_uv.y) * 6.9 + vec2(u_time * 0.022, -u_time * 0.015));
  vec2 warp = vec2(n - 0.5, noise(v_uv * 11.7 - u_time * 0.014) - 0.5) * u_texel * 2.66;
  vec2 sampleUv = clamp(advectedUv + warp, vec2(0.001), vec2(0.999));

  float center = texture(u_field, sampleUv).r;
  float neighbors = texture(u_field, sampleUv + vec2(u_texel.x, 0.0)).r
    + texture(u_field, sampleUv - vec2(u_texel.x, 0.0)).r
    + texture(u_field, sampleUv + vec2(0.0, u_texel.y)).r
    + texture(u_field, sampleUv - vec2(0.0, u_texel.y)).r;
  float diffusionStrength = min(1.0, u_dt * 3.67 * mix(0.16, 1.0, bottomResistance));
  float diffusion = mix(center, neighbors * 0.25, diffusionStrength);

  float noisyDecay = mix(1.69, 2.22, n);
  float density = max(0.0, diffusion * exp(-noisyDecay * u_dt));

  vec2 noiseVelocity = vec2(
    noise(v_uv * 5.6 + vec2(0.0, u_time * 0.045)) - 0.5,
    noise(v_uv * 5.6 + vec2(19.3, -u_time * 0.038)) - 0.5
  );
  vec2 flowPoint = vec2(v_uv.x * u_aspect, v_uv.y) * 8.5 + vec2(u_time * 0.04, -u_time * 0.03);
  float flowStep = 0.025;
  float flowLeft = noise(flowPoint - vec2(flowStep, 0.0));
  float flowRight = noise(flowPoint + vec2(flowStep, 0.0));
  float flowDown = noise(flowPoint - vec2(0.0, flowStep));
  float flowUp = noise(flowPoint + vec2(0.0, flowStep));
  vec2 curlFlow = vec2(flowUp - flowDown, flowLeft - flowRight);
  velocity = advected.gb + (noiseVelocity * 0.055 + curlFlow * 0.546) * density * u_dt;
  if (velocity.y < 0.0) velocity.y *= bottomResistance;
  velocity *= exp(-3.35 * u_dt);

  out_color = vec4(density, velocity, 1.0);
}
`;

const DISPLAY_SHADER = `#version 300 es
precision highp float;

uniform sampler2D u_field;
uniform sampler2D u_image;
uniform vec2 u_canvasSize;
uniform vec2 u_imageSize;
uniform float u_time;

in vec2 v_uv;
out vec4 out_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 15731.743);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  float density = texture(u_field, v_uv).r;
  float coarseNoise = noise(v_uv * 20.85 + vec2(u_time * 0.028, -u_time * 0.021));
  float fineNoise = noise(v_uv * u_canvasSize / 17.33 + u_time * 0.052);
  float filamentNoise = noise(v_uv * vec2(31.0, 18.0) + vec2(-u_time * 0.018, u_time * 0.026));
  float shapedDensity = density
    + (coarseNoise - 0.5) * 0.054
    + (fineNoise - 0.5) * 0.012
    + (filamentNoise - 0.5) * 0.02;
  float alpha = smoothstep(0.075, 0.36, shapedDensity);
  alpha = pow(alpha, 0.86);
  float bottomFadeDepth = 0.14 + (coarseNoise - 0.5) * 0.025;
  alpha *= smoothstep(0.0, bottomFadeDepth, v_uv.y);

  float canvasAspect = u_canvasSize.x / u_canvasSize.y;
  float imageAspect = u_imageSize.x / u_imageSize.y;
  vec2 imageUv = v_uv;
  if (imageAspect > canvasAspect) {
    float visibleWidth = canvasAspect / imageAspect;
    imageUv.x = (imageUv.x - 0.5) * visibleWidth + 0.5;
  } else {
    float visibleHeight = imageAspect / canvasAspect;
    imageUv.y = (imageUv.y - 0.5) * visibleHeight + 0.5;
  }

  vec3 imageColor = texture(u_image, imageUv).rgb;
  out_color = vec4(imageColor * alpha, alpha);
}
`;

const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const createProgram = (gl: WebGL2RenderingContext, fragmentSource: string) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
};

const uniform = (gl: WebGL2RenderingContext, program: WebGLProgram, name: string) =>
  gl.getUniformLocation(program, name);

export function HeroReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (readProjectReturnSlug()) return;

    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>('.hero');
    if (!canvas || !hero) return;

    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
      stencil: false,
    });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return;

    const splatProgram = createProgram(gl, SPLAT_SHADER);
    const simulationProgram = createProgram(gl, SIMULATION_SHADER);
    const displayProgram = createProgram(gl, DISPLAY_SHADER);
    if (!splatProgram || !simulationProgram || !displayProgram) return;

    const vertexArray = gl.createVertexArray();
    const positionBuffer = gl.createBuffer();
    if (!vertexArray || !positionBuffer) return;
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    [splatProgram, simulationProgram, displayProgram].forEach((program) => {
      const location = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    });

    const makeFieldTarget = () => {
      const texture = gl.createTexture();
      const framebuffer = gl.createFramebuffer();
      if (!texture || !framebuffer) return null;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, FIELD_SIZE, FIELD_SIZE, 0, gl.RGBA, gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return { framebuffer, texture };
    };

    const initialReadTarget = makeFieldTarget();
    const initialWriteTarget = makeFieldTarget();
    if (!initialReadTarget || !initialWriteTarget || gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return;
    let readTarget = initialReadTarget;
    let writeTarget = initialWriteTarget;

    const imageTexture = gl.createTexture();
    if (!imageTexture) return;
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([247, 247, 245, 0]));

    const image = new Image();
    const splats: Splat[] = [];
    let animationFrame = 0;
    let activeUntil = 0;
    let canvasHeight = 1;
    let canvasWidth = 1;
    let imageHeight = 1;
    let imageReady = false;
    let imageWidth = 1;
    let isVisible = true;
    let lastFrameTime = performance.now();
    let lastPointer: { time: number; x: number; y: number } | null = null;

    const swapTargets = () => {
      const nextRead = writeTarget;
      writeTarget = readTarget;
      readTarget = nextRead;
    };

    const bindTexture = (texture: WebGLTexture, unit = 0) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    };

    const draw = () => gl.drawArrays(gl.TRIANGLES, 0, 3);

    const clearField = () => {
      [readTarget, writeTarget].forEach((target) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.viewport(0, 0, FIELD_SIZE, FIELD_SIZE);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = Math.max(1, bounds.width);
      canvasHeight = Math.max(1, bounds.height);
      const width = Math.round(canvasWidth * pixelRatio);
      const height = Math.round(canvasHeight * pixelRatio);
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const addSplat = (x: number, y: number, deltaX: number, deltaY: number, speed: number) => {
      const speedFactor = Math.min(1, speed / 1.2);
      splats.push({
        density: 1.41 + speedFactor * 0.44,
        velocityX: Math.max(-0.59, Math.min(0.59, deltaX * 7.01)),
        velocityY: Math.max(-0.59, Math.min(0.59, deltaY * 7.01)),
        x,
        y: 1 - y,
      });
      if (splats.length > MAX_SPLATS_PER_FRAME) splats.splice(0, splats.length - MAX_SPLATS_PER_FRAME);
    };

    const applySplats = () => {
      if (splats.length === 0) return;
      gl.useProgram(splatProgram);
      gl.uniform1i(uniform(gl, splatProgram, 'u_field'), 0);
      gl.uniform1f(uniform(gl, splatProgram, 'u_aspect'), canvasWidth / canvasHeight);
      gl.uniform1f(uniform(gl, splatProgram, 'u_radius'), 0.00225);

      splats.splice(0, MAX_SPLATS_PER_FRAME).forEach((splat) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, writeTarget.framebuffer);
        gl.viewport(0, 0, FIELD_SIZE, FIELD_SIZE);
        bindTexture(readTarget.texture);
        gl.uniform2f(uniform(gl, splatProgram, 'u_point'), splat.x, splat.y);
        gl.uniform2f(uniform(gl, splatProgram, 'u_velocity'), splat.velocityX, -splat.velocityY);
        gl.uniform1f(uniform(gl, splatProgram, 'u_density'), splat.density);
        draw();
        swapTargets();
      });
    };

    const simulate = (dt: number, now: number) => {
      gl.useProgram(simulationProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, writeTarget.framebuffer);
      gl.viewport(0, 0, FIELD_SIZE, FIELD_SIZE);
      bindTexture(readTarget.texture);
      gl.uniform1i(uniform(gl, simulationProgram, 'u_field'), 0);
      gl.uniform2f(uniform(gl, simulationProgram, 'u_texel'), 1 / FIELD_SIZE, 1 / FIELD_SIZE);
      gl.uniform1f(uniform(gl, simulationProgram, 'u_dt'), dt);
      gl.uniform1f(uniform(gl, simulationProgram, 'u_time'), now / 1000);
      gl.uniform1f(uniform(gl, simulationProgram, 'u_aspect'), canvasWidth / canvasHeight);
      draw();
      swapTargets();
    };

    const display = (now: number) => {
      gl.useProgram(displayProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      bindTexture(readTarget.texture, 0);
      bindTexture(imageTexture, 1);
      gl.uniform1i(uniform(gl, displayProgram, 'u_field'), 0);
      gl.uniform1i(uniform(gl, displayProgram, 'u_image'), 1);
      gl.uniform2f(uniform(gl, displayProgram, 'u_canvasSize'), canvasWidth, canvasHeight);
      gl.uniform2f(uniform(gl, displayProgram, 'u_imageSize'), imageWidth, imageHeight);
      gl.uniform1f(uniform(gl, displayProgram, 'u_time'), now / 1000);
      draw();
    };

    const render = (now: number) => {
      animationFrame = 0;
      if (!mediaQuery.matches || !imageReady || !isVisible) return;

      const dt = Math.min(0.033, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;
      applySplats();
      simulate(dt, now);
      display(now);

      if (now < activeUntil || splats.length > 0) animationFrame = window.requestAnimationFrame(render);
      else clearField();
    };

    const requestRender = () => {
      activeUntil = performance.now() + ACTIVE_TAIL_MS;
      if (!animationFrame && imageReady && isVisible && mediaQuery.matches) {
        lastFrameTime = performance.now();
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!mediaQuery.matches || event.pointerType === 'touch') return;
      const bounds = hero.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      const now = performance.now();

      if (lastPointer) {
        const deltaX = x - lastPointer.x;
        const deltaY = y - lastPointer.y;
        const distancePixels = Math.hypot(deltaX * bounds.width, deltaY * bounds.height);
        const stepCount = Math.max(1, Math.min(20, Math.ceil(distancePixels / 13)));
        const elapsedSeconds = Math.max(0.008, (now - lastPointer.time) / 1000);
        const speed = Math.hypot(deltaX, deltaY) / elapsedSeconds;
        for (let step = 1; step <= stepCount; step += 1) {
          const progress = step / stepCount;
          addSplat(
            lastPointer.x + deltaX * progress,
            lastPointer.y + deltaY * progress,
            deltaX / stepCount,
            deltaY / stepCount,
            speed,
          );
        }
      } else {
        addSplat(x, y, 0, 0, 0);
      }

      lastPointer = { time: now, x, y };
      requestRender();
    };

    const handlePointerLeave = () => {
      lastPointer = null;
    };

    const handleMediaChange = () => {
      lastPointer = null;
      splats.length = 0;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      resize();
      clearField();
    };

    const handleResize = () => {
      resize();
      requestRender();
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else if (isVisible && splats.length > 0) {
        requestRender();
      }
    });

    image.decoding = 'async';
    image.onload = () => {
      imageReady = true;
      imageWidth = image.naturalWidth;
      imageHeight = image.naturalHeight;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      bindTexture(imageTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      resize();
      clearField();
    };
    image.src = '/images/hero/home-reveal-underlay-03.jpg';

    resize();
    clearField();
    visibilityObserver.observe(hero);
    window.addEventListener('resize', handleResize, { passive: true });
    hero.addEventListener('pointermove', handlePointerMove, { passive: true });
    hero.addEventListener('pointerleave', handlePointerLeave);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      hero.removeEventListener('pointermove', handlePointerMove);
      hero.removeEventListener('pointerleave', handlePointerLeave);
      mediaQuery.removeEventListener('change', handleMediaChange);
      image.onload = null;
      gl.deleteTexture(readTarget.texture);
      gl.deleteTexture(writeTarget.texture);
      gl.deleteFramebuffer(readTarget.framebuffer);
      gl.deleteFramebuffer(writeTarget.framebuffer);
      gl.deleteTexture(imageTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(splatProgram);
      gl.deleteProgram(simulationProgram);
      gl.deleteProgram(displayProgram);
    };
  }, []);

  return <canvas aria-hidden="true" className="hero-reveal-canvas" ref={canvasRef} />;
}
