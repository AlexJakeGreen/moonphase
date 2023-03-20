'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const St = imports.gi.St;

const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Moon = Me.imports.lunarphase;

// We'll extend the Button class from Panel Menu so we can do some setup in
// the init() function.
var ExampleIndicator = GObject.registerClass(
    {GTypeName: 'ExampleIndicator'},
    class ExampleIndicator extends PanelMenu.Button {

        _init() {
            super._init(0.0, `${Me.metadata.name} Indicator`, false);

            this.icon = new St.Icon({
                style_class: 'system-status-icon'
            });
            this.updateIcon();
            this.add_child(this.icon);

            this.menuItem = new PopupMenu.PopupMenuItem('Loading...', false);
            this.menu.addMenuItem(this.menuItem);
            this.updateLabel();

            GLib.timeout_add_seconds(
                GLib.PRIORITY_DEFAULT,
                1,
                this.update.bind(this)
            );
        }

        update() {
            this.updateIcon();
            this.updateLabel();
        }

        updateLabel() {
            let phase = Moon.getLunarPhase();
            this.menuItem.label.text = `Moon phase: ${phase}`;
        }

        updateIcon() {
            let s = Moon.getPhaseNumber();
            let iconPath = `${Me.path}/icons/${s}.png`;
            let gicon = Gio.icon_new_for_string(`${iconPath}`);
            this.icon.gicon = gicon;
            return GLib.SOURCE_CONTINUE;
        };
    }
)


// We're going to declare `indicator` in the scope of the whole script so it can
// be accessed in both `enable()` and `disable()`
var indicator = null;


function init() {
    log(`initializing ${Me.metadata.name} version ${Me.metadata.version}`);
}


function enable() {
    log(`enabling ${Me.metadata.name} version ${Me.metadata.version}`);

    indicator = new ExampleIndicator();

    // The `main` import is an example of file that is mostly live instances of
    // objects, rather than reusable code. `Main.panel` is the actual panel you
    // see at the top of the screen.
    Main.panel.addToStatusArea(`${Me.metadata.name} Indicator`, indicator);
}


function disable() {
    log(`disabling ${Me.metadata.name} version ${Me.metadata.version}`);

    // REMINDER: It's required for extensions to clean up after themselves when
    // they are disabled. This is required for approval during review!
    if (indicator !== null) {
        indicator.destroy();
        indicator = null;
    }
}
