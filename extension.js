
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Moon from './lunarphase.js' ;
const { Gio, GLib, St } = imports.gi;


export default class Moonphase extends Extension {

    _indicator = null;

    update() {
        this.updateIcon();
        return GLib.SOURCE_CONTINUE;
    }


    updateIcon() {
        let s = Moon.getPhaseNumber();
        let iconPath = `${this.path}/icons/${s}.png`;
        let gicon = Gio.icon_new_for_string(iconPath);
        this._indicator.icon.gicon = gicon;
    }


    enable() {
        let indicatorName = `Moonphase`;
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);

        this._indicator.icon = new St.Icon({style_class: 'system-status-icon'});
        this.updateIcon();
        this._indicator.add_child(this._indicator.icon);

        Main.panel.addToStatusArea(indicatorName, this._indicator);

        GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            3600,
            this.update.bind(this)
        );
    }


    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
