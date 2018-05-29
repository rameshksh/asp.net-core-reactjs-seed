export class UtilityService {
    private _router: any;

    constructor() {

    }

    convertDateTime(date: Date) {
        var _formattedDate = new Date(date.toString());
        return _formattedDate.toDateString();
    }

    navigate(path: string) {
        this._router.navigate([path]);
    }

    navigateToSignIn() {
        this.navigate('/account/login');
    }
}