export const datepickerStyles = {
  wrapper: {
    backgroundColor: '#fff',
    border: '1px solid #dadada',
    height: '100%'
  },
  headerArrows: {
    color: '#02AEFF'
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  }
}

export const singleDatepickerAttrs = {
  mode: 'single',
  isExpanded: true,
  isRequired: true,
  popoverVisibility: 'focus',
  themeStyles: datepickerStyles,
  style: {width: '100%'}
}
