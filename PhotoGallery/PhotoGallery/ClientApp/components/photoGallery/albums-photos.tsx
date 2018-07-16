import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Photo } from '../../core/domain/photo';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { NotificationService } from '../../core/services/notification.service';
import { Paginated } from '../../core/common/paginated';
import { OperationResult } from '../../core/domain/operationResult';

export class AlbumPhotosComponent extends React.Component<RouteComponentProps<any>, any> {
    private _albumsAPI: string = 'api/albums/';
    private _photosAPI: string = 'api/photos/';
    private _albumId: string;
    private _albumPhotos: Array<Photo>;
    private _displayingTotal: number;
    private _albumTitle: string;
    private _page: number = 1;
    private _pagesCount: number;
    private _totalCount: number;

    public dataService: DataService;
    public utilityService: UtilityService;
    public notificationService: NotificationService;

    constructor() {
        super();
        //this.state = { _page: 0, _pagesCount: 0, _totalCount: 0, range };
        this.dataService = new DataService();       
    }

    componentDidMount() {
        this.getAlbumPhotos();
    } 

    public render() {
        const albumPhotos = this._albumPhotos.map((image: Photo) => (
            <div className="thumbnail blue-thumb">
                <NavLink to={image.Uri} className="fancybox center-block" title={image.Title}>
                    <img className="media-object center-block" height="120" src={image.Uri} alt="" />
                </NavLink>
                <div className="row caption img-caption">
                    <div className="row remove-caption">
                        <div className="col-xs-10 dateCaption">{this.convertDateTime(image.DateUploaded)}</div>
                        <div className="col-xs-2 buttonCaption">
                            <button className="btn btn-xs btn-danger" onClick={() => { this.delete(image) }}>
                                <span className="fa-stack fa-1x">
                                    <i className="fa fa-remove fa-stack-1x fa-inverse"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <strong>{image.Title}</strong>
                </div>
            </div>
        ));

        return <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">
                        {this._albumTitle}
                        <small>Page {this._page + 1} of {this._pagesCount}</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <NavLink to={'/home'}>
                                Home
                                      </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/albums'}>
                                Albums
                                     </NavLink>
                        </li>
                        <li>{this._albumTitle}</li>
                        <li className="active">Photos</li>
                    </ol>
                </div>
            </div>

            <div className="row text-center">
                <div className="col-md-3 col-sm-6 hero-feature">
                    {
                        albumPhotos
                    }
                </div>
            </div>
        </div>;
    }

    getAlbumPhotos(): void {
        this.dataService.get(this._page)
            .then(res => {

                var data: any = res.json();

                this._albumPhotos = data.Items;
                this._displayingTotal = this._albumPhotos.length;
                this._page = data.Page;
                this._pagesCount = data.TotalPages;
                this._totalCount = data.TotalCount;
                this._albumTitle = this._albumPhotos[0].AlbumTitle;
            }).catch(error => {

                if (error.status == 401 || error.status == 302) {
                    this.utilityService.navigateToSignIn();
                }

                console.error('Error: ' + error)
            });
    }


    search(i: number): void {
        this.search(i);
        this.getAlbumPhotos();
    }

    convertDateTime(date: Date) {
        return this.utilityService.convertDateTime(date);
    }

    delete(photo: Photo) {
        var _removeResult: OperationResult = new OperationResult(false, '');

        this.notificationService.printConfirmationDialog('Are you sure you want to delete the photo?',
            () => {
                this.dataService.deleteResource(this._photosAPI + photo.Id)
                    .then(res => {
                        _removeResult.Succeeded = res.Succeeded;
                        _removeResult.Message = res.Message;
                    }).then(
                    () => {
                        if (_removeResult.Succeeded) {
                            this.notificationService.printSuccessMessage(photo.Title + ' removed from gallery.');
                            this.getAlbumPhotos();
                        }
                        else {
                            this.notificationService.printErrorMessage('Failed to remove photo');
                        }
                    }).
                    catch(error => console.error('Error: ' + error));
            });
    }
}