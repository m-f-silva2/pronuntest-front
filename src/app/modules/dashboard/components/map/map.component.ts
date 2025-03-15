import { AfterViewInit, Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { Cluster, OSM, Vector } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import { Circle as CircleStyle, Text } from 'ol/style.js';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  @Input('data') data: { points: [[number, number]] } = <any>{};
  private map: Map = new Map;
  private center: [number, number][] = this.data.points;//capital bogota
  private maxFeatureCount = 0;
  private vector :any;
  private color = [[138, 93, 80, 0.7], [180, 63, 80, 0.7]];
  private vectorLayer!: Vector;
  private vectorSource!: VectorSource;
  private textFill = new Fill({
    color: '#fff',
  });
  private textStroke = new Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 2.5,
  });
  public currentResolution: any = 0;
  title: String = 'Mapa de usuarios';

  public listCoordLongLat2 = {
    points: [{coord:[]}],
    magnitude: 5
  }

  ngOnInit(): void {
    if(this.center == undefined){
      this.center = this.data.points;
      
      console.log("pont",this.center);
    }
    //this.generateRandomPoints(this.center,10);
    setTimeout(() => {
      this.renderMap();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const current: [number, number][] = changes['data'].currentValue.points;
      
      if (Array.isArray(current)) {
        this.center = current;
        current.map((coord: any) => {
          const [lat, lng] = coord;
          this.center.push([lng, lat]);
          // Aquí puedes realizar otras acciones con coord
          // Por ejemplo, si coord es un array de [lat, lng], podrías hacer lo siguiente:
          // const [lat, lng] = coord;
          // console.log(`Latitud: ${lat}, Longitud: ${lng}`);
        });
      } else {
        console.error('Data is not an array:', current);
      }
      this.updateMap();
    }
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

    
    //console.log(">>>", this.center)
    this.vector = new VectorLayer({
      source: new Cluster({
        distance: 4,
        source: new VectorSource({
          features: this.center.map((coord) => new Feature({
            geometry: new Point(fromLonLat(coord)),
            properties: {
              magnitude: Math.random() * 5, // Ejemplo de propiedad adicional
              colorPosition: 1
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
        zoom: 6.5,
      }),
    });

    this.map.render();
  }

  updateMap() {
      if (this.map && this.vector) {
        let updatedLayer = new VectorLayer({
          source: new Cluster({
            distance: 10,
            source: new VectorSource({
              features: this.center.map((coord) => new Feature({
                geometry: new Point(fromLonLat(coord)),
                properties: {
                  magnitude: Math.random() * 5, // Ejemplo de propiedad adicional
                  colorPosition: 1
                },
              })),
            }),
          }),
          style: this.styleFunction,
        });

        // Actualiza las capas en el mapa
        let layers = this.map.getLayers().getArray();
        layers[1] = updatedLayer;
        this.map.render();
      } else {
        
        //this.renderMap(); // Render map initially if not already done
      }
  }

  createEarthquakeStyle(feature: any) {
    const magnitude = this.listCoordLongLat2.magnitude;
    const radius = 3 * magnitude ;
    let colorPosition = feature.get('colorPosition');
    colorPosition = colorPosition != null ? colorPosition : 0;

    return new Style({
      geometry: feature.getGeometry(),
      image: new CircleStyle({
        radius: radius,
        fill: new Fill({ color: this.color[colorPosition] }),
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
    let colorPosition = feature.get('colorPosition');

    if (size > 0) {
      let radiusCircle = size < 4 ? 15 : 5*size;
      colorPosition = colorPosition != null ? colorPosition : 0;
      style = new Style({
        image: new CircleStyle({
          radius: radiusCircle,
          fill: new Fill({
            color: [this.color[colorPosition][0], this.color[colorPosition][1], this.color[colorPosition][2], Math.min(0.5, 0.4 + size / this.maxFeatureCount)],
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: this.textFill,
          stroke: this.textStroke,
          scale: 2,
        }),
      });
    } else {
      const originalFeature = feature.get('features')[0];
      style = this.createEarthquakeStyle(originalFeature);
    }

    return style;
  }
}