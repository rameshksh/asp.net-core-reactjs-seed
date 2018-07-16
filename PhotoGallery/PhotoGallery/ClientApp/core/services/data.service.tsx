import 'isomorphic-fetch';

interface AlbumDataExampleState {
    data: any[];
    loading: boolean;
}

export class DataService {

    public _pageSize: number = 10;
    public _baseUri: string;

    constructor() { }

    set(baseUri: string): void {
        this._baseUri = baseUri;
    }

    get(page: number = 1) {
        var uri = this._baseUri + page.toString() + '/' + this._pageSize.toString();


        return fetch(uri)
            .then(response => {
                return response.json() as Promise<any[]>
            }).catch(err => err);;
    }

    post(data: any, mapJson: boolean = true) {

        return fetch(this._baseUri, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res;
        }).catch(err => err);
    }

    deleteResource(resource: string) {
        return fetch(this._baseUri, {
            method: 'DELETE',
            body: JSON.stringify(resource),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res;
        }).catch(err => err);
    }
}