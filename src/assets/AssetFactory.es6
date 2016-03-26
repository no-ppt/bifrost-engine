import ImageAsset       from './ImageAsset';
import FontAsset        from './FontAsset';
import LoggerFactory    from '../core/logger/LoggerFactory';

const logger = LoggerFactory.getLogger( 'AssetFactory' );

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class AssetFactory {

    static create( data ) {
        switch ( data.type ) {
            case 'ImageAsset':
                return new ImageAsset( data );
            case 'FontAsset':
                return new FontAsset( data );
            default:
                logger.error( `[create] Unsupported asset type [${ data.type }]` );
        }
    }
}