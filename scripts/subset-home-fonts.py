"""Generate same-outline Latin WOFF2 subsets (requires fonttools[woff]).

Full source fonts remain available for CJK and other characters. Keep these
ranges in sync with the complementary @font-face ranges in app/globals.css.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
RANGES = [(0, 0x24F), (0x1E00, 0x1EFF), (0x2000, 0x206F),
          (0x20A0, 0x20CF), (0x2100, 0x214F), (0x2190, 0x21FF),
          (0x2212, 0x2212), (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD)]

for weight, extension in [(300, 'ttf'), (500, 'otf'), (700, 'otf')]:
    directory = ROOT / 'public/fonts/source-han-sans'
    source = directory / f'noto-sans-sc-{weight}.{extension}'
    font = TTFont(source)
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=[code for start, end in RANGES for code in range(start, end + 1)])
    subsetter.subset(font)
    font.flavor = 'woff2'
    target = directory / f'noto-sans-sc-{weight}-latin.woff2'
    font.save(target)
    print(f'{target.name}: {target.stat().st_size:,} bytes')
