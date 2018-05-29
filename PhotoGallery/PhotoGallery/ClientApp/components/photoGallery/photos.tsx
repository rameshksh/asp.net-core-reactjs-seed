import * as React from 'react';
import { RouteComponentProps, RouteProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Photo } from '../../core/domain/photo';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { NotificationService } from '../../core/services/notification.service';
import { Paginated } from '../../core/common/paginated';
import { OperationResult } from '../../core/domain/operationResult';
import { Album } from '../../core/domain/album';

interface PhotoState {
    currentCount: number;
}

export class PhotosComponent extends React.Component<RouteComponentProps<any>, PhotoState> {
    private _photosAPI: string = 'api/photos/';
    private _photos: Array<Photo>;

    private _page: number;
    private _pagesCount: number;
    private _totalCount: number;

    constructor(public photosService: DataService,
        public utilityService: UtilityService,
        public notificationService: NotificationService) {
        super();
        //this.state = { _page: 0, _pagesCount: 0, _totalCount: 0, range };

        this.photosService.set(this._photosAPI);
        this.getPhotos();
    }

    public render() {
        return <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">
                        Photo Gallery photos
                                <small><i>(all albums displayed)</i></small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <NavLink to={'/home'}>
                                Home
                            </NavLink>
                        </li>
                        <li className="active">Photos</li>
                    </ol>
                </div>
            </div>
            <div className="row">
                {
                    this._photos.map(image => {
                        <div className="col-lg-3 col-md-4 col-xs-6 picture-box">
                            <NavLink to={image.Uri} className="fancybox" rel="gallery" title={image.Title} >
                                <img className="img img-responsive full-width thumbnail" src={image.Uri} alt={image.Title} />
                            </NavLink>
                        </div>
                    })
                }
            </div>
        </div >;
    }

    getPhotos(): void {
        let self = this;
        self.photosService.get(self._page)
            .then(res => {

                var data: any = res.json();

                self._photos = data.Items;
                self._page = data.Page;
                self._pagesCount = data.TotalPages;
                self._totalCount = data.TotalCount;
            }, error => console.error('Error: ' + error));
    }

    search(i: number): void {
        this.search(i);
        this.getPhotos();
    };
}