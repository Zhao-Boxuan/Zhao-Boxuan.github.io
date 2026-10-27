interface DecorativeNetworkProps {
  className?: string;
  variant?: 'home' | 'detail';
}

export function DecorativeNetwork({ className = '', variant = 'home' }: DecorativeNetworkProps) {
  return (
    <>
      <div className={`line-network line-network-${variant} ${className}`.trim()} aria-hidden="true">
        <span className="network-axis axis-v axis-v-a" />
        <span className="network-axis axis-v axis-v-b" />
        <span className="network-axis axis-v axis-v-c" />
        <span className="network-axis axis-h axis-h-a" />
        <span className="network-axis axis-h axis-h-b" />
        <span className="network-axis axis-h axis-h-c" />
        <span className="network-axis axis-h axis-h-d" />

        <span className="network-orbit orbit-a" />
        <span className="network-orbit orbit-b" />
        <span className="network-orbit orbit-c" />
        <span className="network-orbit orbit-d" />
        <span className="network-orbit orbit-e" />
        <span className="network-orbit orbit-f" />
        <span className="network-orbit orbit-mid-a" />
        <span className="network-orbit orbit-mid-b" />
        <span className="network-orbit orbit-mid-c" />
        <span className="network-orbit orbit-mid-d" />

        <span className="network-cross cross-a" />
        <span className="network-cross cross-b" />
        <span className="network-cross cross-c" />

        <span className="network-measure measure-a">R / 0720</span>
        <span className="network-measure measure-b">AXIS / 08.33</span>
        <span className="network-measure measure-c">SYS / ZBX—01</span>

        <span className="network-node node-a"><i>01 / X-184</i></span>
        <span className="network-node node-b"><i>02 / Y-520</i></span>
        <span className="network-node node-c"><i>03 / R-720</i></span>
        <span className="network-node node-d"><i>04 / X-831</i></span>
        <span className="network-node node-e"><i>05 / Y-764</i></span>
      </div>
      {variant === 'home' && (
        <div className="continuous-orbit-layer" aria-hidden="true">
          <span className="network-orbit continuous-orbit-about" />
        </div>
      )}
    </>
  );
}
