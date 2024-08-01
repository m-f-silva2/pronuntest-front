import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { Cluster, OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import { Circle as CircleStyle } from 'ol/style.js';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  //public dashboardService = inject(DashboardService);
  private map: Map = new Map;
  private center: [number, number][] = [
    [-76.5988923721,	2.45994897276], 
    [-76.5888923721,	2.43994897276], 
    [-76.5988923721,	2.43994897276],
    [-76.5988923721,	2.43894897276],
    [-76.6098923721,	2.44894897276]];
  private maxFeatureCount = 0;
  private vector :any;
  public currentResolution: any = 0;
  private textFill = new Fill({
    color: '#fff',
  });
  private textStroke = new Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 2.5,
  });

  public listCoordLongLat2 = {
    points: [{coord:[]}],
    magnitude: 5
  }

  ngOnInit(): void {
    this.generateRandomPoints(this.center, 7)
    this.renderMap();

    /*this.dashboardService.messageObservable$.subscribe((responseForm: any) => {
      this.listCoordLongLat2 = responseForm.mapData;
      //console.log("maps",this.listCoordLongLat2);

      let updatedLayer = new VectorLayer({
        source: new Cluster({
          distance: 10,
          source: new VectorSource({
            features: this.listCoordLongLat2.points.map((point) =>{
              return new Feature({
                geometry: new Point([...fromLonLat(point.coord)]),
                properties: {
                  magnitude: this.listCoordLongLat2.magnitude
                },
              })
            }),
          }),
        }),
        style: this.styleFunction,
      });

      // Actualiza las capas en el mapa
      let layers = this.map.getLayers().getArray();
      layers[1] = updatedLayer;
      this.map.render();
    });*/
  }

  private generateRandomPoints(center: [number, number][], numPoints: number) {
    const randomPoints: [number, number][] = [];
  
    center.forEach(coord => {
      for (let i = 0; i < numPoints; i++) {
        const randomLon = coord[0] + (Math.random() - 0.5) * 0.01; // Desplazamiento aleatorio en longitud
        const randomLat = coord[1] + (Math.random() - 0.5) * 0.01; // Desplazamiento aleatorio en latitud
        randomPoints.push([randomLon, randomLat]);
      }
    });

    this.center = randomPoints
  }

  renderMap() {
    const tileLayer = new TileLayer({
      source: new OSM(),
    });

    this.vector = new VectorLayer({
      source: new Cluster({
        distance: 10,
        source: new VectorSource({
          features: this.center.map((coord) => new Feature({
            geometry: new Point(fromLonLat(coord)),
            properties: {
              magnitude: Math.random() * 10 // Ejemplo de propiedad adicional
            },
          })),
        }),
      }),
      style: this.styleFunction,
    });

    this.map = new Map({
      layers: [tileLayer, this.vector],
      target: 'ol-map',
      view: new View({
        center: [...fromLonLat(this.center[0])],
        zoom: 12.5,
      }),
    });

    this.map.render();
  }

  createEarthquakeStyle(feature: any) {
    const magnitude = this.listCoordLongLat2.magnitude;
    const radius = 3 * magnitude ;

    return new Style({
      geometry: feature.getGeometry(),
      image: new CircleStyle({
        radius: radius,
        fill: new Fill({ color: [238, 93, 80, 0.7] }),
        stroke: new Stroke({ color: 'white', width: 1 }),
      }),
    });
  }

  calculateClusterInfo = (resolution: any) => {
    this.maxFeatureCount = 0;
    const features = this.vector.getSource().getFeatures();
    let feature, radius;

    for (let i = features.length - 1; i >= 0; --i) {
      feature = features[i];
      const originalFeatures = feature.get('features');
      //console.log("feat: ", features);
      const extent = createEmpty();
      let j, jj;

      for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
        extend(extent, originalFeatures[j].getGeometry().getExtent());
      }

      this.maxFeatureCount = Math.max(this.maxFeatureCount, jj);
      radius = (0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
      feature.set('radius', radius);
    }
  }

  styleFunction = (feature: any, resolution: any): Style | undefined => {
    if (resolution !== this.currentResolution) {
      this.calculateClusterInfo(resolution);
      this.currentResolution = resolution;
    }

    let style: Style | undefined;
    const size = feature.get('features').length;

    if (size > 1) {
      let radiusCircle = size > 4 ? 28 : 5*size;
      style = new Style({
        image: new CircleStyle({
          radius: radiusCircle,
          fill: new Fill({
            color: [238, 93, 80, Math.min(0.5, 0.4 + size / this.maxFeatureCount)],
          }),
        }),
        text: undefined,
      });
    } else {
      const originalFeature = feature.get('features')[0];
      style = this.createEarthquakeStyle(originalFeature);
    }

    return style;
  }
}