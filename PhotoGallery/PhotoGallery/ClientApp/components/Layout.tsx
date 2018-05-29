import * as React from 'react';
import { NavMenu } from './NavMenu';
import { MembershipService } from '../core/services/membership.service';
import { User } from '../core/domain/user';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {

    constructor(public membershipService: MembershipService, public location: Location) {
        super();
    }


    public render() {
        return <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-3'>
                    <NavMenu />
                </div>
                <div className='col-sm-9'>
                    { this.props.children }
                </div>
            </div>
        </div>;
    }

    isUserLoggedIn(): boolean {
        return this.membershipService.isUserAuthenticated();
    }

    getUserName(): string {
        if (this.isUserLoggedIn()) {
            var _user = this.membershipService.getLoggedInUser();
            return _user.Username;
        }
        else
            return 'Account';
    }

    logout(): void {
        this.membershipService.logout()
            .then(res => {
                localStorage.removeItem('user');
            }).catch(error => console.error('Error: ' + error));
    }
}
