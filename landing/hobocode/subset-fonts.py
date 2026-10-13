"""Regenerate web fonts: python subset-fonts.py /path/to/current/app/Resources/Fonts
Requires fonttools[woff] and brotli. Preserve the shipped OFL license files.
"""
import sys
from pathlib import Path
from fontTools import subset
here = Path(__file__).resolve().parent
source = Path(sys.argv[1])
target = here.parent.parent / 'hobocode/fonts'
text = (here / 'content.mjs').read_text() + (here / 'generate.mjs').read_text() + ''.join(chr(i) for i in range(32, 127))
for name in ['BlackHanSans-Regular', 'NanumGothicCoding-Regular', 'NanumGothicCoding-Bold', 'SairaStencilOne-Regular']:
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_legacy = True
    font = subset.load_font(str(source / (name + '.ttf')), options)
    selection = subset.Subsetter(options=options)
    selection.populate(text=text)
    selection.subset(font)
    subset.save_font(font, str(target / (name + '.woff2')), options)
