import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import {
    loginUser
} from './authSlice'

const Login = React.lazy(() => import('../../components/Login/Login'))

const AuthContainer = ({
    loginUser,
    props
}) => {
    return (

        <Login
            {...props}
            loginUser={loginUser}
        />
    )
}

const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
const selectUser = (state) => state.auth.user;

const mapStateToProps = (state) => ({
    isAuthenticated: selectIsAuthenticated(state),
    user: selectUser(state)
})

const mapDispatchToProps = {
    loginUser
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer)