import * as React from 'react';
import { RouteComponentProps, RouteProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Photo } from '../../core/domain/photo';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { NotificationService } from '../../core/services/notification.service';
import { Paginated } from '../../core/common/paginated';
import { OperationResult } from '../../core/domain/operationResult';

interface Photos {
    _photos: Array<Photo>
}

export class PhotosComponent extends React.Component<RouteComponentProps<any>, Photos> {
    private _photosAPI: string = 'api/photos/';
   // private _photos: Array<Photo>;
    private _page: number;
    private _pagesCount: number;
    private _totalCount: number;

    public photosService: DataService;
    public utilityService: UtilityService;
    public notificationService: NotificationService;

    constructor() {
        super();
        this.state = { _photos : new Array<Photo>()};        
        this.photosService = new DataService();        
        this.photosService.set(this._photosAPI);       
    }

    componentDidMount() {
        this.getPhotos();
    }  

    getPhotos(): void {      
        this.photosService.get(this._page)
            .then(res => {
                this.setState({
                    _photos: res.Items
                });
                //this._photos = res.Items;
                this._page = res.Page;
                this._pagesCount = res.TotalPages;
                this._totalCount = res.TotalCount;
            }, error => console.error('Error: ' + error));
    }

    search(i: number): void {
        this.search(i);
        this.getPhotos();
    };

    public render() {
        const photos = this.state._photos.map((image: Photo) => (
            <div className="col-lg-3 col-md-4 col-xs-6 picture-box">
                <Link to={image.Uri} className="fancybox" rel="gallery" title={image.Title} >
                    <img className="img img-responsive full-width thumbnail" src={image.Uri} alt={image.Title} />
                </Link>
            </div>
        ));

        return (
            <div className="container">
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
                        photos
                    }
                </div>
           </div >
        );
    }
}