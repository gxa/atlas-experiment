import PropTypes from 'prop-types'

export default {
  data: PropTypes.arrayOf(PropTypes.shape({
    properties: PropTypes.oneOfType([
      PropTypes.shape({
        analysed: PropTypes.bool.isRequired
      }).isRequired,
      PropTypes.shape({
        contrastName: PropTypes.string.isRequired,
        referenceOrTest: PropTypes.oneOf([`reference`, `test`, ``])
      }).isRequired
    ]),
    values: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired).isRequired
  }).isRequired).isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }).isRequired).isRequired
}
