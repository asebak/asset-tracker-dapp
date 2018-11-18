import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'

const mapStateToProps = (state, ownProps) => {
  return {
    name: ""
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onProfileFormSubmit: (name) => {
      //event.preventDefault();

     // dispatch(updateUser(name))
    }
  }
}

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default ProfileFormContainer
