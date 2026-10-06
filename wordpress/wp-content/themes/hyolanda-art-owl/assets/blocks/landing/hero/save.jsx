const { RichText, useBlockProps } = wp.blockEditor;

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

function getParallaxClass(speed) {
  return speed && speed !== 'none' ? `landing-hero--parallax-${speed}` : '';
}

function Cta({ text, url, target, style, backgroundColor, textColor }) {
  if (!text && !url) {
    return null;
  }

  const className = [
    'landing-hero__cta',
    `landing-hero__cta--${style}`,
    getColorClass(backgroundColor, 'background'),
    getColorClass(textColor),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      className={className}
      href={url || '#'}
      target={target ? '_blank' : undefined}
      rel={target ? 'noopener noreferrer' : undefined}
    >
      {text}
    </a>
  );
}

export default function Save({ attributes }) {
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

  const blockProps = useBlockProps.save({
    className: [
      'landing-hero',
      getParallaxClass(parallaxSpeed),
      backgroundType === 'image' && backgroundImageUrl
        ? 'landing-hero--has-image'
        : '',
      backgroundType === 'color' ? getColorClass(backgroundColor, 'background') : '',
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      backgroundImage:
        backgroundType === 'image' && backgroundImageUrl
          ? `url("${backgroundImageUrl}")`
          : undefined,
      backgroundPosition:
        backgroundType === 'image' ? backgroundPosition : undefined,
    },
  });

  return (
    <section
      {...blockProps}
      data-parallax-speed={backgroundType === 'image' ? parallaxSpeed : undefined}
    >
      <div className="landing-hero__overlay" />

      <div className="landing-hero__content">
        <RichText.Content
          tagName="p"
          className={[
            'landing-hero__subtitle',
            getColorClass(subtitleColor),
            getFontClass(subtitleFontFamily),
          ]
            .filter(Boolean)
            .join(' ')}
          value={subtitle}
        />

        <RichText.Content
          tagName="h1"
          className={[
            'landing-hero__title',
            getColorClass(titleColor),
            getFontClass(titleFontFamily),
          ]
            .filter(Boolean)
            .join(' ')}
          value={title}
        />

        <div className="landing-hero__ctas">
          <Cta
            text={cta1Text}
            url={cta1Url}
            target={cta1Target}
            style={cta1Style}
            backgroundColor={cta1BackgroundColor}
            textColor={cta1TextColor}
          />

          <Cta
            text={cta2Text}
            url={cta2Url}
            target={cta2Target}
            style={cta2Style}
            backgroundColor={cta2BackgroundColor}
            textColor={cta2TextColor}
          />
        </div>
      </div>
    </section>
  );
}
