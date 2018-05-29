import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LoginComponent } from './components/account/login';
import { RegisterComponent } from './components/account/register';

import { AlbumsComponent } from './components/photoGallery/albums';
import { PhotosComponent } from './components/photoGallery/photos';
import { AlbumPhotosComponent } from './components/photoGallery/albums-photos';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route  path='/login' component={LoginComponent} />
    <Route  path='/register' component={RegisterComponent} />
    <Route  path='/photos' component={PhotosComponent} />
    <Route  path='/albums' component={AlbumsComponent} />
    <Route  path='/albums/:id/photos' component={AlbumPhotosComponent} />
</Layout>;
