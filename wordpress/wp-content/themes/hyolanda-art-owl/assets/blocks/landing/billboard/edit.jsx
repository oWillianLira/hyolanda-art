const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;
const { __experimentalInputControl: InputControl, PanelBody } = wp.components;
const { useEffect, useRef, useState } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { title, animationSpeed = 15 } = attributes;
  const contentRef = useRef(null);
  const [titleCopies, setTitleCopies] = useState(2);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return undefined;
    }

    const updateCopies = () => {
      const titleElement = content.querySelector('.landing-billboard__title');
      const titleWidth = titleElement?.getBoundingClientRect().width;

      if (!content.clientWidth || !titleWidth) {
        setTitleCopies(2);
        return;
      }

      setTitleCopies(Math.max(2, Math.ceil(content.clientWidth / titleWidth) + 1));
    };

    const observer = new ResizeObserver(updateCopies);
    observer.observe(content);
    updateCopies();

    return () => observer.disconnect();
  }, [title]);

  const blockProps = useBlockProps({
    style: {
      '--billboard-animation-duration': `${animationSpeed}s`,
    },
  });

  const repeatedTitles = Array.from({ length: titleCopies }, (_, index) => (
    <RichText.Content
      key={index}
      tagName="h1"
      className="landing-billboard__title"
      value={title}
      aria-hidden={index > 0 ? 'true' : undefined}
    />
  ));

  return (
    <section {...blockProps}>
      <InspectorControls>
        <PanelBody title="Billboard" initialOpen>
          <div className="custom-richtext">
            <small className="custom-richtext__label">ANIMATED TEXT</small>
            <div className="custom-richtext__input">
              <RichText
                tagName="h4"
                identifier="landing-billboard__title"
                placeholder="Enter text..."
                allowedFormats={['core/bold', 'core/italic']}
                value={title}
                onChange={(value) => setAttributes({ title: value })}
              />
            </div>
          </div>
          <InputControl
            label="Animation duration (seconds)"
            type="number"
            min={5}
            max={30}
            step={1}
            value={animationSpeed}
            onChange={(value) =>
              setAttributes({ animationSpeed: value === '' ? 15 : Number(value) })
            }
          />
        </PanelBody>
      </InspectorControls>

      <div className="landing-billboard__content" ref={contentRef}>
        <div className="landing-billboard__track is-ready">
          <div className="landing-billboard__group">{repeatedTitles}</div>
          <div className="landing-billboard__group" aria-hidden="true">
            {repeatedTitles}
          </div>
        </div>
      </div>
    </section>
  );
}
