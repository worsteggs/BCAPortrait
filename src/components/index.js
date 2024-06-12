import BPagetitle from "./BPagetitle";
import BButton from "./BButton";
import BPane from "./BPane";
import BUpload from "./BUpload";
import BSelect from "./BSelect";
import BPaneTitle from "./BPaneTitle";
import BrainImgWrap from "./BrainImgWrap";
import BPaneLabel from "./BPane/BPaneLabel";
export default {
  install: (vue) => {
    vue.component(BButton.name, BButton);
    vue.component(BPane.name, BPane);
    vue.component(BPagetitle.name, BPagetitle);
    vue.component(BUpload.name, BUpload);
    vue.component(BSelect.name, BSelect);
    vue.component(BPaneTitle.name, BPaneTitle);
    vue.component(BrainImgWrap.name, BrainImgWrap);
    vue.component(BPaneLabel.name, BPaneLabel);
  },
};
