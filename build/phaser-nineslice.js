/*!
 * phaser-nineslice - version 1.0.0 
 * NineSlice plugin for Phaser.io!
 *
 * OrangeGames
 * Build at 03-02-2016
 * Released under MIT License 
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fabrique;
(function (Fabrique) {
    var NineSlice = (function (_super) {
        __extends(NineSlice, _super);
        function NineSlice(game, x, y, key, width, height) {
            _super.call(this, game, x, y, key);
            this.baseTexture = this.texture.baseTexture;
            var data = game.cache.getNineSlice(key);
            if (undefined === data) {
                return;
            }
            this.leftSize = data.left;
            this.topSize = data.top;
            this.rightSize = data.right;
            this.bottomSize = data.bottom;
            this.resize(width, height);
        }
        /**
         * Redraw the the current texture to adjust for the new sizes;
         */
        NineSlice.prototype.renderTexture = function () {
            //Set a new empty texture
            this.loadTexture(new Phaser.RenderTexture(this.game, this.localWidth, this.localHeight));
            //The positions we want from the base texture
            var textureXs = [0, this.leftSize, this.baseTexture.width - this.rightSize, this.baseTexture.width];
            var textureYs = [0, this.topSize, this.baseTexture.height - this.bottomSize, this.baseTexture.height];
            //These are the positions we need the eventual texture to have
            var finalXs = [0, this.leftSize, this.localWidth - this.rightSize, this.localWidth];
            var finalYs = [0, this.topSize, this.localHeight - this.bottomSize, this.localHeight];
            for (var yi = 0; yi < 3; yi++) {
                for (var xi = 0; xi < 3; xi++) {
                    var s = this.createTexturePart(textureXs[xi], //x
                    textureYs[yi], //y
                    textureXs[xi + 1] - textureXs[xi], //width
                    textureYs[yi + 1] - textureYs[yi] //height
                    );
                    s.width = finalXs[xi + 1] - finalXs[xi];
                    s.height = finalYs[yi + 1] - finalYs[yi];
                    this.texture.renderXY(s, finalXs[xi], finalYs[yi]);
                }
            }
        };
        /**
         * Set the size of the container, then update all the parts
         *
         * @param width
         * @param height
         */
        NineSlice.prototype.resize = function (width, height) {
            this.localWidth = width;
            this.localHeight = height;
            this.renderTexture();
        };
        /**
         * Here we create a sprite part for the container based on the given input
         *
         * @param x
         * @param y
         * @param width
         * @param height
         * @returns {PIXI.Sprite}
         */
        NineSlice.prototype.createTexturePart = function (x, y, width, height) {
            var frame = new PIXI.Rectangle(this.texture.frame.x + x, this.texture.frame.y + y, width, height);
            return new Phaser.Image(this.game, 0, 0, new PIXI.Texture(this.baseTexture, frame));
        };
        return NineSlice;
    })(Phaser.Image);
    Fabrique.NineSlice = NineSlice;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Plugins;
    (function (Plugins) {
        var NineSlice = (function (_super) {
            __extends(NineSlice, _super);
            function NineSlice(game, parent) {
                _super.call(this, game, parent);
                this.addNineSliceCache();
                this.addNineSliceFactory();
                this.addNineSliceLoader();
            }
            NineSlice.prototype.addNineSliceLoader = function () {
                Phaser.Loader.prototype.nineSlice = function (key, url, top, left, right, bottom) {
                    if (!left) {
                        left = top;
                    }
                    if (!right) {
                        right = left;
                    }
                    if (!bottom) {
                        bottom = top;
                    }
                    var cacheData = {
                        top: top,
                        bottom: bottom,
                        left: left,
                        right: right
                    };
                    this.addToFileList('image', key, url);
                    this.game.cache.addNineSlice(key, cacheData);
                };
            };
            /**
             * Extends the GameObjectFactory prototype with the support of adding NineSlice. this allows us to add NineSlice methods to the game just like any other object:
             * game.add.NineSlice();
             */
            NineSlice.prototype.addNineSliceFactory = function () {
                Phaser.GameObjectFactory.prototype.nineSlice = function (x, y, key, width, height, group) {
                    if (group === undefined) {
                        group = this.world;
                    }
                    var nineSliceObject = new Fabrique.NineSlice(this.game, x, y, key, width, height);
                    return group.add(nineSliceObject);
                };
                Phaser.GameObjectCreator.prototype.nineSlice = function (x, y, key, width, height) {
                    return new Fabrique.NineSlice(this.game, x, y, key, width, height);
                };
            };
            /**
             * Extends the Phaser.Cache prototype with NineSlice properties
             */
            NineSlice.prototype.addNineSliceCache = function () {
                //Create the cache space
                Phaser.Cache.prototype.nineSlice = {};
                //Method for adding a NineSlice dict to the cache space
                Phaser.Cache.prototype.addNineSlice = function (key, data) {
                    this.nineSlice[key] = data;
                };
                //Method for fetching a NineSlice dict from the cache space
                Phaser.Cache.prototype.getNineSlice = function (key) {
                    var data = this.nineSlice[key];
                    if (undefined === data) {
                        console.warn('Phaser.Cache.getNineSlice: Key "' + key + '" not found in Cache.');
                    }
                    return data;
                };
            };
            return NineSlice;
        })(Phaser.Plugin);
        Plugins.NineSlice = NineSlice;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-nineslice.js.map