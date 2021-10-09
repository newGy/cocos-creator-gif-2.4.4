import { GIFCache } from "./GIF";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CCGIF extends cc.Component {
    @property(cc.String)
    path: string = '';

    public delays = [];
    public gifSp: cc.Sprite;
    public frames: cc.SpriteFrame[] = [];

    onLoad() {
        this.gifSp = this.node.getComponent(cc.Sprite);//this.node.addComponent(cc.Sprite);
    }
    async preload() {
        GIFCache.getInstance();
        return new Promise<void>((rs, rj) => {
            cc.resources.load(this.path, (err, data: any) => {
                console.log(err, data);
                if (err) {
                    rj(err);
                    return;
                }
                this.delays = data._nativeAsset.delays.map(v => v / 1e2);
                this.frames = data._nativeAsset.spriteFrames;
                rs();
            })
        })
    }

    async loadUrl(url) {
        GIFCache.getInstance();
        return new Promise<void>((rs, rj) => {
            cc.assetManager.loadAny({url: url}, (err, data: any) => {
                console.log(err, data);
                if (err) {
                    rj(err);
                    return;
                }
                this.delays = data.delays.map(v => v / 1e2);
                this.frames = data.spriteFrames;
                this.play(true);
                rs();
            })
        })
    }
    frameIdx = 0;
    play(loop = false, playNext = false) {
        if (!playNext) {
            this.stop();
        }
        if (this.frames.length) {
            if (this.frameIdx >= this.frames.length) {
                this.frameIdx = 0;
                if (!loop) {
                    return;
                }
            }
            this.gifSp.spriteFrame = this.frames[this.frameIdx];
            this.scheduleOnce(() => {
                this.play(loop, true);
            }, this.delays[this.frameIdx]);
            this.frameIdx++;
        }
    }
    stop() {
        this.frameIdx = 0;
        this.unscheduleAllCallbacks();
    }
}