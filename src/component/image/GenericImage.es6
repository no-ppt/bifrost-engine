import * as THREE       from 'three';
import Component        from '../Component';
import AssetManager     from '../../assets/AssetManager';
import AssetStatus      from '../../assets/AssetStatus';
import ContextHelper    from '../../core/utils/ContextHelper';

/**
 * Default image offset.
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
 * Generic image for display pixel image.
 *
 * @author hermit
 * @version 2.0.0
 * @since 1.0.0
 */
export default class GenericImage extends Component {

    /**
     * Create image component with specified parameters.
     *
     * @param params image component info.
     */
    constructor(params) {
        super(params);

        // Merge options.
        this._options.offset       = Object.assign({}, DEFAULT_OFFSET, params.offset);
        this._options.textureScale = Object.assign({}, DEFAULT_TEXTURE_SCALE, params.imageScale);

        // Create mesh.
        this._imageMesh = this._createMesh();
        this.add(this._imageMesh);
    }

    updateOpacity() {
        this._imageMesh.material.opacity = this.opacity;
    }

    _createMesh() {
        return new THREE.Mesh(this._createGeometry(), this._createMaterial());
    }

    _createGeometry() {
        return new THREE.PlaneBufferGeometry(this._options.width, this._options.height);
    }

    _createMaterial() {

        let texture = this._createTexture();

        // Create material.
        let material = new THREE.MeshBasicMaterial({
            map        : texture,
            transparent: this._options.transparent,
            alphaTest  : this._options.alphaTest,
            depthTest  : this._options.depthTest,
            side       : this._options.side
        });

        // Set opacity.
        material.opacity = this.opacity;

        // Set polygon offset to ensure z-index.
        material.polygonOffset       = this._options.polygonOffset;
        material.polygonOffsetFactor = -this._options.polygonOffsetFactor;
        material.polygonOffsetUnits  = -this._options.polygonOffsetUnits;

        return material;
    }

    _createTexture() {

        // Get asset from asset manager.
        let asset = this._getAsset();

        // Create texture.
        let texture = new THREE.Texture(asset.image, THREE.UVMapping,
            THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
            THREE.LinearFilter, THREE.LinearFilter,
            THREE.RGBAFormat, THREE.UnsignedByteType, 16);

        // Set texture UV mapping.
        texture.repeat.x = 1 / this._options.textureScale.x;
        texture.repeat.y = 1 / this._options.textureScale.y;
        texture.offset.x = -this._options.offset.x;
        texture.offset.y = 1 - texture.repeat.y + this._options.offset.y;

        // Bind asset event.
        asset.addEventListener('StatusChange',
            ContextHelper.delegate(function (event, change) {
                if (change.after === AssetStatus.LOADED) {

                    // Update texture min filter.
                    if (this._isMipMap(asset.image)) {
                        texture.minFilter = THREE.LinearMipMapLinearFilter;
                    }
                    texture.needsUpdate = true;
                }
            }, this));

        // Update texture min filter.
        if (this._isMipMap(asset.image)) {
            texture.minFilter = THREE.LinearMipMapLinearFilter;
        }
        texture.needsUpdate = true;

        return texture;
    }

    _isMipMap(image) {
        //noinspection JSBitwiseOperatorUsage
        return !(image.width & (image.width - 1)) && !(image.height & (image.height - 1 ));
    }

    _getAsset() {

        let asset;
        if (this._options.src.substr(0, 4) === 'ref:') {

            // Get image asset from asset manager.
            let id = this._options.src.substr(4);
            asset  = AssetManager.instance.get(id);
        } else {

            // TODO: Test
            asset = AssetManager.load({
                type: 'ImageAsset',
                src : this._options.src
            });
            AssetManager.add(asset);
        }
        return asset;
    }
}