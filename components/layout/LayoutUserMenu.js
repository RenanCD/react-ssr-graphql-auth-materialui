import cookie from "cookie"
import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { ApolloConsumer } from 'react-apollo'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import redirect from "../../lib/redirect"
import { setUser } from '../../lib/store'


class LayoutUserMenu extends Component {
    signout = apolloClient => () => {
        document.cookie = cookie.serialize('token', '', {
            maxAge: -1 // Expire the cookie immediately
        })

        // Force a reload of all the current queries now that the user is
        // logged in, so we don't accidentally leave any state around.
        apolloClient.cache.reset().then(() => {
            // Redirect to a more useful page when signed out
            redirect({}, '/login')
        })
    }

    render () {
        const { data, dispatch } = this.props

        if (data.error) return <div>{error.message}</div>

        if (data.loading) {
            return <div>Loading...</div>
        } else {
            dispatch(setUser(data.me))
        }

        if(data.me) {
            return (
                <List>
                    <div>
                        <Link href='/social/profile'>
                            <ListItem button as="a" href='/social/profile'>
                                <ListItemIcon>
                                    <i className="large user circle icon"></i>
                                </ListItemIcon>
                                <ListItemText primary={data.me.username}/>
                            </ListItem>
                        </Link>
                    </div>
                    <div>
                        <ApolloConsumer>
                            {client => (
                                <ListItem button onClick={this.signout(client)}>
                                    <ListItemIcon>
                                        <i className="large sign-out icon"></i>
                                    </ListItemIcon>
                                    <ListItemText primary={data.me ? "Logout" : "-"}/>
                                </ListItem>
                            )}
                        </ApolloConsumer>
                    </div>
                </List>
            )
        } else {
            return (
                <List>
                    <div>
                        <Link prefetch href='/auth/login'>
                            <ListItem button as="a" href='/auth/login'>
                                <ListItemIcon>
                                    <i className="large sign-in icon"></i>
                                </ListItemIcon>
                                <ListItemText primary="Login"/>
                            </ListItem>
                        </Link>
                    </div>
                    <div>
                        <Link prefetch href='/auth/register'>
                            <ListItem button as="a" href='/auth/register'>
                                <ListItemIcon>
                                    <i className="large user plus icon"></i>
                                </ListItemIcon>
                                <ListItemText primary="Register"/>
                            </ListItem>
                        </Link>
                    </div>
                </List>
            )
        }
    }
}

// Redux
LayoutUserMenu = connect()(LayoutUserMenu)

// Apollo
export const loggedInUser = gql`
  query getUser {
    me {
      id
      username
    }
  }
`
export default graphql(loggedInUser)(LayoutUserMenu)
