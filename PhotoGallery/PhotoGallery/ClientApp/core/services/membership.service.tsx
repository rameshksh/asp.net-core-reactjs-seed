import { DataService } from './data.service';
import { Registration } from '../domain/registration';
import { User } from '../domain/user';

export class MembershipService {

    private _accountRegisterAPI: string = 'api/account/register/';
    private _accountLoginAPI: string = 'api/account/authenticate/';
    private _accountLogoutAPI: string = 'api/account/logout/';

    constructor(public accountService: DataService) { }

    register(newUser: Registration) {

        this.accountService.set(this._accountRegisterAPI);

        return this.accountService.post(JSON.stringify(newUser));
    }

    login(creds: User) {
        this.accountService.set(this._accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds));
    }

    logout() {
        this.accountService.set(this._accountLogoutAPI);
        return this.accountService.post(null, false);
    }

    isUserAuthenticated(): boolean {
        var _user: any = localStorage.getItem('user');
        if (_user != null)
            return true;
        else
            return false;
    }

    getLoggedInUser(): User {
        if (this.isUserAuthenticated()) {
            var data = localStorage.getItem('user');
            var _userData = JSON.parse(data ? data : "");
            return new User(_userData.Username, _userData.Password);
        }

        return new User("", "");
    }
}