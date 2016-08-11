import THREE            from 'three';
import Component        from '../Component';
import ContextHelper    from '../../core/utils/ContextHelper';

const FLEX_VERTICAL_ALIGN_MAPPING = {
    top   : 'flex-start',
    center: 'center',
    bottom: 'flex-end'
};

const DEFAULT_ALIGN = {
    vertical: 'top'
};


/**
 * Default texture offset.
 *
 * @type {{x: number, y: number}}
 */
const DEFAULT_OFFSET = {
    x: 0,
    y: 0
};

const DEFAULT_TEXTURE_SCALE = {
    x: 1,
    y: 1
};

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class PlaneText extends Component {

    constructor( params ) {
        super( params );

        // Merge options.
        this._options.offset       = Object.assign( {}, DEFAULT_OFFSET, params.offset );
        this._options.padding      = params.padding || 0;
        this._options.align        = Object.assign( {}, DEFAULT_ALIGN, params.align );
        this._options.textureScale = Object.assign( {}, DEFAULT_TEXTURE_SCALE );

        // Create mesh.
        this._textMesh = this._createMesh();
        this.add( this._textMesh );
    }

    updateOpacity() {
        this._textMesh.material.opacity = this.opacity;
    }

    _createMesh() {
        return new THREE.Mesh( this._createGeometry(), this._createMaterial() );
    }

    _createGeometry() {
        return new THREE.PlaneBufferGeometry( this._options.width, this._options.height );
    }

    _createMaterial() {

        let texture = this._createTexture();

        // Create material.
        let material = new THREE.MeshBasicMaterial( {
            map        : texture,
            transparent: this._options.transparent,
            alphaTest  : this._options.alphaTest,
            depthTest  : this._options.depthTest,
            side       : THREE.DoubleSide
        } );

        // Set opacity.
        material.opacity = this.opacity;

        // Set polygon offset to ensure z-index.
        texture.polygonOffset       = this._options.polygonOffset;
        texture.polygonOffsetFactor = -this._options.polygonOffsetFactor;
        texture.polygonOffsetUnits  = -this._options.polygonOffsetUnits;

        return material;
    }

    _createTexture() {

        // Calculate the MipMap size.
        this._mipmapWidth            = this._nearestPowValue( this._options.width );
        this._mipmapHeight           = this._nearestPowValue( this._options.height );
        this._options.textureScale.x = this._mipmapWidth / this._options.width;
        this._options.textureScale.y = this._mipmapHeight / this._options.height;

        // Create SVG image.
        let canvas = this._createCanvas();
        let svg    = this._createSVG();

        // Create texture.
        let texture = new THREE.Texture( canvas, THREE.UVMapping,
            THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
            THREE.NearestFilter, THREE.NearestMipMapLinearFilter,
            THREE.RGBAFormat, THREE.UnsignedByteType, 16 );

        // Set texture UV mapping.
        texture.repeat.x = 1 / this._options.textureScale.x;
        texture.repeat.y = 1 / this._options.textureScale.y;
        texture.offset.x = -this._options.offset.x;
        texture.offset.y = 1 - texture.repeat.y + this._options.offset.y;

        // Draw SVG to canvas.
        this._draw( canvas, svg )
            .then( ContextHelper.delegate( function ( image ) {

                // Update texture min filter.
                if ( this._isMipMap( image ) ) {
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                }
                texture.needsUpdate = true;
            }, this ) )
            .catch( function ( e ) {
                throw e;
            } );

        return texture;
    }

    _draw( canvas, svg ) {
        return new Promise( ContextHelper.delegate( function ( resolve, reject ) {
            let image = new Image();
            image.addEventListener( 'load', function () {

                // Get context 2d.
                let context = canvas.getContext( '2d' );
                context.drawImage( image, 0, 0 );

                // Resolve promise.
                resolve( image );
            } );
            image.addEventListener( 'error', function ( e ) {
                reject( e );
            } );
            image.src = `data:image/svg+xml;charset=utf-8,${ svg }`;
        }, this ) );
    }

    _createCanvas() {
        let canvas    = document.createElement( 'canvas' );
        canvas.width  = this._mipmapWidth;
        canvas.height = this._mipmapHeight;
        return canvas;
    }

    _createSVG() {

        // Create DIV & fix '&nbsp;' problem.
        let div  = this._createElementDiv();
        let html = div.outerHTML.replace( /&nbsp;/g, '<span style="color: transparent;">,</span>' );

        return `<svg xmlns="http://www.w3.org/2000/svg" `
               + ` width="${ this._mipmapWidth * window.devicePixelRatio }" `
               + ` height="${ this._mipmapHeight * window.devicePixelRatio }">`
               + `<foreignObject width="100%" height="100%">`
               + `<div id="foreignObject" xmlns="http://www.w3.org/1999/xhtml">${ html }</div>`
               + `</foreignObject>`
               + `</svg>`;
    }

    _createElementDiv() {
        let div                = document.createElement( 'div' );
        div.style.display      = 'flex';
        div.style.flexFlow     = 'wrap';
        div.style.alignContent = FLEX_VERTICAL_ALIGN_MAPPING[ this._options.align.vertical ];
        div.style.alignItems   = FLEX_VERTICAL_ALIGN_MAPPING[ this._options.align.vertical ];
        div.style.width        = `${ this._options.width }px`;
        div.style.height       = `${ this._options.height }px`;
        div.style.padding      = `${ this._options.padding }px`;
        this._appendText( div );
        return div;
    }

    _appendText( div ) {
        this._options.paragraphs.forEach( function ( paragraph ) {

            let p         = document.createElement( 'p' );
            p.style.width = '100%';
            this._fillStyles( p, paragraph );

            if ( !paragraph.characters || paragraph.characters.length === 0 ) {
                p.innerHTML = '<span style="color: transparent;">,</span>';
            }

            paragraph.characters.forEach( function ( character ) {
                let c       = document.createElement( 'span' );
                c.innerHTML = character.content;
                this._fillStyles( c, character );
                p.appendChild( c );
            }, this );

            div.appendChild( p );
        }, this );
    }

    _fillStyles( target, model ) {

        target.style.margin = 0;

        if ( model.align && model.align.horizontal ) {
            target.style.textAlign = model.align.horizontal;
        }
        if ( model.padding ) {
            target.style.padding = `${ model.padding }px`;
        }
        if ( model.color ) {
            target.style.color = model.color;
        }
        if ( model.background ) {
            target.style.background = model.background;
        }
        if ( model.font ) {
            if ( model.font.family ) {
                target.style.fontFamily = model.font.family;
            }
            if ( model.font.size ) {
                target.style.fontSize = `${ model.font.size }px`;
            }
        }
        if ( model.bold != null ) {
            target.style.fontWeight = model.bold ? 'bold' : 'normal';
        }
        if ( model.italic != null ) {
            target.style.fontStyle = model.italic ? 'italic' : 'normal';
        }
        if ( model.underline && model.strikethrough ) {
            target.style.textDecoration = 'underline line-through';
        } else if ( model.underline ) {
            target.style.textDecoration = 'underline';
        } else if ( model.strikethrough ) {
            target.style.textDecoration = 'line-through';
        }
        if ( model.lineHeight != null ) {
            target.style.lineHeight = `${ model.lineHeight }em`;
        }
        if ( model.letterSpacing != null ) {
            target.style.letterSpacing = `${ model.letterSpacing }em`;
        }
    }

    _isMipMap( image ) {
        //noinspection JSBitwiseOperatorUsage
        return !(image.width & (image.width - 1)) && !(image.height & (image.height - 1 ));
    }

    _nearestPowValue( value ) {

        let temp  = value;
        let count = 0;
        while ( temp > 1 ) {
            count++;
            temp /= 2;
        }
        return Math.pow( 2, count );
    }
}