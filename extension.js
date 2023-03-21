'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const St = imports.gi.St;
const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const PanelMenu = imports.ui.panelMenu;
const Moon = Me.imports.lunarphase;


class Extension {

    constructor() {
        this._indicator = null;
    }


    update() {
        this.updateIcon();
        return GLib.SOURCE_CONTINUE;
    }


    updateIcon() {
        let s = Moon.getPhaseNumber();
        let iconPath = `${Me.path}/icons/${s}.png`;
        let gicon = Gio.icon_new_for_string(`${iconPath}`);
        this._indicator.icon.gicon = gicon;
    }


    enable() {
        log(`enabling ${Me.metadata.name}`);

        let indicatorName = `${Me.metadata.name} Indicator`;

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


    // REMINDER: It's required for extensions to clean up after themselves when
    // they are disabled. This is required for approval during review!
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);

    return new Extension();
}
