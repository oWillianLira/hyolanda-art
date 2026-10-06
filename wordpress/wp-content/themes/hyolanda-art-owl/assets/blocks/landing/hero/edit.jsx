const {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  RichText,
  useBlockProps,
  useSettings,
} = wp.blockEditor;
const { Button, PanelBody, SelectControl, TextControl } = wp.components;
const { Fragment } = wp.element;

const PARALLAX_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Slow', value: 'slow' },
  { label: 'Medium', value: 'medium' },
  { label: 'Fast', value: 'fast' },
];

const BACKGROUND_POSITIONS = [
  { label: 'Center Center', value: 'center center' },
  { label: 'Center Top', value: 'center top' },
  { label: 'Center Bottom', value: 'center bottom' },
  { label: 'Left Center', value: 'left center' },
  { label: 'Right Center', value: 'right center' },
];

const BUTTON_STYLES = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
];

function normalizePresets(presets) {
  if (Array.isArray(presets)) {
    return presets;
  }

  if (!presets || typeof presets !== 'object') {
    return [];
  }

  return Object.values(presets).flatMap((group) =>
    Array.isArray(group) ? group : [],
  );
}

function getPaletteOptions(palette) {
  const colors = normalizePresets(palette);

  return [
    { label: 'Default', value: '' },
    ...colors.map((color) => ({
      label: color.name,
      value: color.slug,
    })),
  ];
}

function getFontFamilyOptions(fontFamilies) {
  const fonts = normalizePresets(fontFamilies);

  return [
    { label: 'Default', value: '' },
    ...fonts.map((font) => ({
      label: font.name,
      value: font.slug,
    })),
  ];
}

function getColorValue(slug, palette) {
  const color = palette.find((item) => item.slug === slug);
  return color ? color.color : undefined;
}

function getColorClass(slug, type = 'color') {
  if (!slug) {
    return '';
  }

  return type === 'background'
    ? `has-${slug}-background-color`
    : `has-${slug}-color`;
}

function getFontClass(slug) {
  return slug ? `has-${slug}-font-family` : '';
}

function CtaControls({ index, attributes, setAttributes, palette }) {
  const prefix = `cta${index}`;
  const text = attributes[`${prefix}Text`];
  const url = attributes[`${prefix}Url`];
  const target = attributes[`${prefix}Target`];
  const style = attributes[`${prefix}Style`];
  const backgroundColor = attributes[`${prefix}BackgroundColor`];
  const textColor = attributes[`${prefix}TextColor`];

  return (
    <PanelBody title={`CTA ${index}`} initialOpen={index === 1}>
      <TextControl
        label="Text"
        value={text}
        onChange={(value) => setAttributes({ [`${prefix}Text`]: value })}
        placeholder={`CTA ${index} text`}
      />

      <TextControl
        label="URL"
        type="url"
        value={url}
        onChange={(value) => setAttributes({ [`${prefix}Url`]: value })}
        placeholder="https://example.com"
      />

      <SelectControl
        label="Style"
        value={style}
        options={BUTTON_STYLES}
        onChange={(value) => setAttributes({ [`${prefix}Style`]: value })}
      />

      <SelectControl
        label="Background color"
        value={backgroundColor}
        options={getPaletteOptions(palette)}
        onChange={(value) => setAttributes({ [`${prefix}BackgroundColor`]: value })}
      />

      <SelectControl
        label="Text color"
        value={textColor}
        options={getPaletteOptions(palette)}
        onChange={(value) => setAttributes({ [`${prefix}TextColor`]: value })}
      />

      <Button
        variant={target ? 'secondary' : 'tertiary'}
        onClick={() => setAttributes({ [`${prefix}Target`]: !target })}
      >
        {target ? 'Open in new tab: Yes' : 'Open in new tab: No'}
      </Button>
    </PanelBody>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const {
    title,
    subtitle,
    titleFontFamily,
    subtitleFontFamily,
    titleColor,
    subtitleColor,
    backgroundType,
    backgroundColor,
    backgroundImageUrl,
    backgroundImageAlt,
    backgroundPosition,
    parallaxSpeed,
    cta1Text,
    cta1Url,
    cta1Target,
    cta1Style,
    cta1BackgroundColor,
    cta1TextColor,
    cta2Text,
    cta2Url,
    cta2Target,
    cta2Style,
    cta2BackgroundColor,
    cta2TextColor,
  } = attributes;

  const [rawPalette, rawFontFamilies] = useSettings(
    'color.palette',
    'typography.fontFamilies',
  );

  const palette = normalizePresets(rawPalette);
  const fontFamilies = normalizePresets(rawFontFamilies);

  const blockProps = useBlockProps({
    className: [
      'landing-hero',
      parallaxSpeed !== 'none' ? `landing-hero--parallax-${parallaxSpeed}` : '',
      backgroundType === 'image' && backgroundImageUrl
        ? 'landing-hero--has-image'
        : '',
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      backgroundColor:
        backgroundType === 'color'
          ? getColorValue(backgroundColor, palette)
          : undefined,
      backgroundImage:
        backgroundType === 'image' && backgroundImageUrl
          ? `url("${backgroundImageUrl}")`
          : undefined,
      backgroundPosition:
        backgroundType === 'image' ? backgroundPosition : undefined,
    },
  });

  const cta1Classes = [
    'landing-hero__cta',
    `landing-hero__cta--${cta1Style}`,
    getColorClass(cta1BackgroundColor, 'background'),
    getColorClass(cta1TextColor),
  ]
    .filter(Boolean)
    .join(' ');

  const cta2Classes = [
    'landing-hero__cta',
    `landing-hero__cta--${cta2Style}`,
    getColorClass(cta2BackgroundColor, 'background'),
    getColorClass(cta2TextColor),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title="Typography" initialOpen>
          <SelectControl
            label="Title font"
            value={titleFontFamily}
            options={getFontFamilyOptions(fontFamilies)}
            onChange={(value) => setAttributes({ titleFontFamily: value })}
          />

          <SelectControl
            label="Subtitle font"
            value={subtitleFontFamily}
            options={getFontFamilyOptions(fontFamilies)}
            onChange={(value) => setAttributes({ subtitleFontFamily: value })}
          />
        </PanelBody>

        <PanelBody title="Colors" initialOpen={false}>
          <SelectControl
            label="Title color"
            value={titleColor}
            options={getPaletteOptions(palette)}
            onChange={(value) => setAttributes({ titleColor: value })}
          />

          <SelectControl
            label="Subtitle color"
            value={subtitleColor}
            options={getPaletteOptions(palette)}
            onChange={(value) => setAttributes({ subtitleColor: value })}
          />

          <SelectControl
            label="Background color"
            value={backgroundColor}
            options={getPaletteOptions(palette)}
            onChange={(value) => setAttributes({ backgroundColor: value })}
            disabled={backgroundType !== 'color'}
          />
        </PanelBody>

        <PanelBody title="Background" initialOpen={false}>
          <SelectControl
            label="Background type"
            value={backgroundType}
            options={[
              { label: 'Solid color', value: 'color' },
              { label: 'Image', value: 'image' },
            ]}
            onChange={(value) => setAttributes({ backgroundType: value })}
          />

          {backgroundType === 'image' && (
            <Fragment>
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) =>
                    setAttributes({
                      backgroundImageId: media.id,
                      backgroundImageUrl: media.url,
                      backgroundImageAlt: media.alt || media.title || '',
                    })
                  }
                  allowedTypes={['image']}
                  value={attributes.backgroundImageId}
                  render={({ open }) => (
                    <div className="landing-hero__media-control">
                      {backgroundImageUrl && (
                        <img
                          src={backgroundImageUrl}
                          alt=""
                          className="landing-hero__media-preview"
                        />
                      )}

                      <Button variant="secondary" onClick={open}>
                        {backgroundImageUrl ? 'Replace image' : 'Select image'}
                      </Button>

                      {backgroundImageUrl && (
                        <Button
                          variant="link"
                          isDestructive
                          onClick={() =>
                            setAttributes({
                              backgroundImageId: 0,
                              backgroundImageUrl: '',
                              backgroundImageAlt: '',
                            })
                          }
                        >
                          Remove image
                        </Button>
                      )}
                    </div>
                  )}
                />
              </MediaUploadCheck>

              <SelectControl
                label="Image position"
                value={backgroundPosition}
                options={BACKGROUND_POSITIONS}
                onChange={(value) =>
                  setAttributes({
                    backgroundPosition: value,
                  })
                }
              />

              <SelectControl
                label="Parallax"
                value={parallaxSpeed}
                options={PARALLAX_OPTIONS}
                onChange={(value) => setAttributes({ parallaxSpeed: value })}
              />
            </Fragment>
          )}
        </PanelBody>

        <CtaControls
          index={1}
          attributes={attributes}
          setAttributes={setAttributes}
          palette={palette}
        />

        <CtaControls
          index={2}
          attributes={attributes}
          setAttributes={setAttributes}
          palette={palette}
        />
      </InspectorControls>

      <section {...blockProps}>
        <div className="landing-hero__overlay" />

        <div className="landing-hero__content">
          <RichText
            tagName="p"
            className={[
              'landing-hero__subtitle',
              getColorClass(subtitleColor),
              getFontClass(subtitleFontFamily),
            ]
              .filter(Boolean)
              .join(' ')}
            value={subtitle}
            onChange={(value) => setAttributes({ subtitle: value })}
            placeholder="Add a subtitle..."
          />

          <RichText
            tagName="h1"
            className={[
              'landing-hero__title',
              getColorClass(titleColor),
              getFontClass(titleFontFamily),
            ]
              .filter(Boolean)
              .join(' ')}
            value={title}
            onChange={(value) => setAttributes({ title: value })}
            placeholder="Add a title..."
            allowedFormats={['core/italic', 'core/bold', 'core/link']}
          />

          {(cta1Text || cta1Url) && (
            <a
              className={cta1Classes}
              href={cta1Url || '#'}
              target={cta1Target ? '_blank' : undefined}
              rel={cta1Target ? 'noopener noreferrer' : undefined}
              onClick={(event) => event.preventDefault()}
            >
              {cta1Text || 'CTA 1'}
            </a>
          )}

          {(cta2Text || cta2Url) && (
            <a
              className={cta2Classes}
              href={cta2Url || '#'}
              target={cta2Target ? '_blank' : undefined}
              rel={cta2Target ? 'noopener noreferrer' : undefined}
              onClick={(event) => event.preventDefault()}
            >
              {cta2Text || 'CTA 2'}
            </a>
          )}
        </div>
      </section>
    </Fragment>
  );
}
