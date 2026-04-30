import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    fetchUserList,
    fetchCreateUser,
    fetchUpdateUser,
    fetchDeleteUser
} from './UserSlice'

const UserManagement = React.lazy(() => import('../../pages/Users/UserManagement'));

const UserContainer = ({
    fetchUserList,
    fetchCreateUser,
    fetchUpdateUser,
    fetchDeleteUser,
    userList,
    isLoading,
    error,
    props
}) => {

    useEffect(() => {
        fetchUserList();
    }, [fetchUserList]);

    return (
        <UserManagement
            fetchUserList={fetchUserList}
            fetchCreateUser={fetchCreateUser}
            fetchUpdateUser={fetchUpdateUser}
            fetchDeleteUser={fetchDeleteUser}
            userList={userList}
            isLoading={isLoading}
            error={error}
            {...props}
        />
    )
}

const mapStateToProps = (state) => ({
    userList: state.user.userList,
    isLoading: state.user.isLoading,
    error: state.user.error,
})

const mapDispatchToProps = {
    fetchUserList,
    fetchCreateUser,
    fetchUpdateUser,
    fetchDeleteUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer)
