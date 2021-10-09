import CCGIF from "./CCGIF";

const { ccclass, property } = cc._decorator;

@ccclass
export class CCGIFTest extends cc.Component {
    @property(cc.Node)
    gifImage: cc.Node = null;

    async start() {
        cc.find('Canvas/loading').active = true;
        cc.find('Canvas/btnPlay').active = false;
        await Promise.all(this.node.children.map(n =>
            n.getComponent(CCGIF).preload()
        ))
        cc.find('Canvas/loading').active = false;
        cc.find('Canvas/btnPlay').active = true;
        console.debug('preload success');
        this.playAll();
    }

    onLoad() {
        let url = "https://n.sinaimg.cn/tech/transform/280/w128h152/20210528/d2fb-kquziih9543861.gif";
        this.gifImage.getComponent(CCGIF).loadUrl(url);
    }
    playAll() {
        this.node.children.forEach(v => v.getComponent(CCGIF).play());
    }
}