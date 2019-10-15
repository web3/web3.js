/*
    This file is part of confluxWeb.
    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/


import ConfluxWeb from 'conflux-web';

// $ExpectType Modules
ConfluxWeb.modules;

// $ExpectType any
ConfluxWeb.givenProvider;

// $ExpectType Providers
ConfluxWeb.providers;

const confluxWeb = new ConfluxWeb('https://localhost:5000/');

// $ExpectType HttpProvider | IpcProvider | WebsocketProvider | ConfluxWebCfxProvider | CustomProvider
confluxWeb.currentProvider;

// $ExpectType Utils
confluxWeb.utils;

// $ExpectType string
confluxWeb.version;

// $ExpectType Cfx
confluxWeb.cfx;

// $ExpectType BatchRequest
new confluxWeb.BatchRequest();
