import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter, RouteProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Photo } from '../../core/domain/photo';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { NotificationService } from '../../core/services/notification.service';
import { Paginated } from '../../core/common/paginated';
import { OperationResult } from '../../core/domain/operationResult';
import { Album } from '../../core/domain/album';

interface Albums {
    _albums: Array<Album>
}

export class AlbumsComponent extends React.Component<RouteComponentProps<any>, Albums> {
    private _albumsAPI: string = 'api/albums/';    
    private _page: number;
    private _pagesCount: number;
    private _totalCount: number;

    public albumsService: DataService;
    public utilityService: UtilityService;
    public notificationService: NotificationService;

    constructor() {
        super();
        this.state = { _albums: new Array<Album>() };
        this._page = 1;
        //this.state = { _page: 0, _pagesCount: 0, _totalCount: 0 };
        this.albumsService = new DataService();
        this.albumsService.set(this._albumsAPI);       
    }

    componentDidMount() {
        this.getAlbums();
    }    

    getAlbums(): void {
        this.albumsService.get(this._page)
            .then(res => {
                debugger;

                this.setState({
                    _albums: res.Items
                });
                this._page = res.Page;
                this._pagesCount = res.TotalPages;
                this._totalCount = res.TotalCount;
            }, error => {

                if (error.status == 401 || error.status == 404) {
                    this.notificationService.printErrorMessage('Authentication required');
                    this.utilityService.navigateToSignIn();
                }
            });
    }


    search(i: number): void {
        this.search(i);
        this.getAlbums();
    }

    convertDateTime(date: Date) {
        return this.utilityService.convertDateTime(date);
    }

    public render() {

        const albumsList = this.state._albums.map((album) => (
            <div className="row">
                <div className="col-md-1 text-center">
                    <p>
                        <i className="fa fa-camera fa-4x"></i>
                    </p>
                    <p>{this.convertDateTime(album.DateCreated)} </p>
                </div>
                <div className="col-md-5">
                    <NavLink to={album.Thumbnail} className="fancybox" rel="gallery" title={album.Title} >
                        <img className="media-object img-responsive album-thumbnail" src={album.Thumbnail} alt={album.Title} />
                    </NavLink>
                </div>
                <div className="col-md-6">
                    <h3>
                        <NavLink to={'/albums/:id/photos'}>
                            {album.Title}
                        </NavLink>
                    </h3>
                    <p>
                        Photos: <span className="badge">{album.TotalPhotos}</span>
                    </p>
                    <p>{album.Description}</p>
                    <NavLink to={'/albums/:id/photos'} className="btn btn-primary">
                        <i className="fa fa-angle-right"></i>
                    </NavLink>
                </div>
            </div>
        ));

        return <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">
                        Photo Gallery albums
                        <small>Page {this._page + 1} of {this._pagesCount}</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <NavLink to={'/home'}>
                                Home
                                      </NavLink>
                        </li>
                        <li className="active">Albums</li>
                    </ol>
                </div>
            </div>

            <div className="row text-center">
                <div className="col-md-3 col-sm-6 hero-feature">
                    {
                        albumsList
                    }
                </div>
            </div>
        </div>;
    }
}