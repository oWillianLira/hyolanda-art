const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls, useSettings } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, ColorPalette, BaseControl } =
  wp.components;

const ANIMATION_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Scale', value: 'scale' },
  { label: 'Fill', value: 'fill' },
  { label: 'Slide', value: 'slide' },
  { label: 'Lift', value: 'lift' },
];

const normalizePalette = (palette) => {
  if (Array.isArray(palette)) {
    return palette;
  }

  if (palette && typeof palette === 'object') {
    return Object.values(palette).flatMap((group) =>
      Array.isArray(group) ? group : [],
    );
  }

  return [];
};

const HoverColorControl = ({ label, value, colors, onChange }) => {
  const selectedColor = colors.find((color) => color.slug === value);

  const colorValue = selectedColor?.color || value || undefined;

  const handleChange = (newColor) => {
    if (!newColor) {
      onChange('');
      return;
    }

    const normalizedColor = newColor.toLowerCase();

    const preset = colors.find(
      (color) => color.color?.toLowerCase() === normalizedColor,
    );

    if (preset) {
      onChange(preset.slug);
      return;
    }

    if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(newColor)) {
      onChange(normalizedColor);
    }
  };

  return (
    <BaseControl label={label}>
      <ColorPalette
        colors={colors}
        value={colorValue}
        onChange={handleChange}
        disableCustomColors={false}
        clearable
      />
    </BaseControl>
  );
};

const withButtonHoverControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (props.name !== 'core/button') {
      return <BlockEdit {...props} />;
    }

    const { attributes, setAttributes } = props;

    const [paletteSetting] = useSettings('color.palette');

    const colors = normalizePalette(paletteSetting);

    return (
      <Fragment>
        <BlockEdit {...props} />

        <InspectorControls group="styles">
          <PanelBody title="Hover Animation" initialOpen={false}>
            <SelectControl
              label="Animation"
              value={attributes.hoverAnimation || 'none'}
              options={ANIMATION_OPTIONS}
              onChange={(value) =>
                setAttributes({
                  hoverAnimation: value,
                })
              }
            />

            <RangeControl
              label="Animation Duration"
              value={attributes.hoverDuration ?? 500}
              onChange={(value) =>
                setAttributes({
                  hoverDuration: value ?? 500,
                })
              }
              min={200}
              max={1500}
              step={100}
              help="Duration in milliseconds."
            />

            <HoverColorControl
              label="Hover Background Color"
              value={attributes.hoverBackgroundColor}
              colors={colors}
              onChange={(value) =>
                setAttributes({
                  hoverBackgroundColor: value,
                })
              }
            />

            <HoverColorControl
              label="Hover Text Color"
              value={attributes.hoverTextColor}
              colors={colors}
              onChange={(value) =>
                setAttributes({
                  hoverTextColor: value,
                })
              }
            />

            <HoverColorControl
              label="Hover Border Color"
              value={attributes.hoverBorderColor}
              colors={colors}
              onChange={(value) =>
                setAttributes({
                  hoverBorderColor: value,
                })
              }
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  };
}, 'withButtonHoverControls');

addFilter('editor.BlockEdit', 'hyo/button-hover-controls', withButtonHoverControls);

const resolveHoverColor = (value) => {
  if (!value || typeof value !== 'string') {
    return undefined;
  }

  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    return value;
  }

  if (/^[a-z0-9-]+$/.test(value)) {
    return `var(--wp--preset--color--${value})`;
  }

  return undefined;
};

const withButtonHoverPreview = createHigherOrderComponent((BlockListBlock) => {
  return (props) => {
    if (props.name !== 'core/button') {
      return <BlockListBlock {...props} />;
    }

    const {
      hoverAnimation = 'none',
      hoverBackgroundColor = '',
      hoverTextColor = '',
      hoverBorderColor = '',
      hoverDuration = 500,
    } = props.attributes;

    const hoverClass = [
      'hyo-button-hover',
      `hyo-button-hover--${hoverAnimation}`,
      hoverBackgroundColor && 'has-hyo-hover-bg',
      hoverTextColor && 'has-hyo-hover-text',
      hoverBorderColor && 'has-hyo-hover-border',
    ]
      .filter(Boolean)
      .join(' ');

    const hoverStyle = {
      '--hyo-hover-duration': `${hoverDuration}ms`,
    };

    if (hoverBackgroundColor) {
      hoverStyle['--hyo-hover-bg'] = resolveHoverColor(hoverBackgroundColor);
    }

    if (hoverTextColor) {
      hoverStyle['--hyo-hover-text'] = resolveHoverColor(hoverTextColor);
    }

    if (hoverBorderColor) {
      hoverStyle['--hyo-hover-border'] = resolveHoverColor(hoverBorderColor);
    }

    return (
      <BlockListBlock
        {...props}
        className={[props.className, hoverClass].filter(Boolean).join(' ')}
        wrapperProps={{
          ...props.wrapperProps,
          style: {
            ...props.wrapperProps?.style,
            ...hoverStyle,
          },
        }}
      />
    );
  };
}, 'withButtonHoverPreview');

addFilter(
  'editor.BlockListBlock',
  'hyo/button-hover-preview',
  withButtonHoverPreview,
);
