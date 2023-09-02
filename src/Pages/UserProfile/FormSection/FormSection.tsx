import f from './FormSection.module.scss'
import FormSectionProps from './FormSection.props'

export default function FormSection(props: FormSectionProps) {
  const { legend, hint, onSubmit, children } = props
  return (
    <form className={f.section} onSubmit={onSubmit}>
      <fieldset className={f.fieldset}>
        {legend && <legend className={f.legend}>{legend}</legend>}
        {hint && <p className={f.hint}>{hint}</p>}
        <div className={f.interactive}>{children}</div>
      </fieldset>
    </form>
  )
}
