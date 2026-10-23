export default function Save({ attributes }) {
  const { RichText, useBlockProps } = wp.blockEditor;
  const { title, animationSpeed } = attributes;
  const blockProps = useBlockProps.save({
    style: {
      '--billboard-animation-duration': `${animationSpeed}s`,
    },
  });

  return (
    <section {...blockProps}>
      <div className="landing-billboard__content">
        <div className="landing-billboard__track">
          <div className="landing-billboard__group">
            <RichText.Content
              tagName="h4"
              className="landing-billboard__title"
              value={title}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
