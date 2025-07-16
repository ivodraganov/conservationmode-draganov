const Lang = imports.lang;
const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Settings = imports.ui.settings;

const UUID = "conservationmode@draganov";
const CONSERVATION_MODE = 'conservationMode';
const FILE_PATH = "/sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode";

const Gettext = imports.gettext;
Gettext.bindtextdomain(UUID, GLib.get_home_dir() + "/.local/share/locale")
function _(str) {
    return Gettext.dgettext(UUID, str);
}

function MyApplet(metadata, orientation, panelHeight, instanceId) {
    this.settings = new Settings.AppletSettings(this, UUID, instanceId);
    this._init(metadata, orientation, panelHeight, instanceId);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(metadata, orientation, panelHeight, instanceId) {
        Applet.IconApplet.prototype._init.call(this, orientation, panelHeight, instanceId);

        try {
            this.set_applet_icon_path(`${GLib.get_home_dir()}/.local/share/cinnamon/applets/${UUID}/icons/environment.png`);
            this.menuManager = new PopupMenu.PopupMenuManager(this);
            this.menu = new Applet.AppletPopupMenu(this, orientation);
            this.menuManager.addMenu(this.menu);

            this.menuItem = new PopupMenu.PopupSwitchMenuItem(_("Battery conservation mode"));
            this.menuItem.connect('toggled', Lang.bind(this, this._onSwitchToggled));
            this.menu.addMenuItem(this.menuItem);

            this._readFileState();

            this.settings.connect(`changed::${CONSERVATION_MODE}`, Lang.bind(this, this._onSettingsChanged));
        } catch (e) {
            globalThis.logError(e);
        }
    },

    on_applet_clicked: function() {
        this.menu.toggle();
    },

    _readFileState: function() {
        try {
            let content = GLib.file_get_contents(FILE_PATH)[1].toString().trim();
            let value = content === "1";
            this.settings.setValue(CONSERVATION_MODE, value);
            this.menuItem.setToggleState(value);
            this._updateTooltip(value);
        } catch (e) {
            globalThis.logError(`Error reading conservation_mode: ${e}`);
        }
    },

    _onSwitchToggled: function(item, state) {
        let value = state ? "1" : "0";
        let command = `pkexec sh -c "echo '${value}' > ${FILE_PATH}"`;
        Util.spawnCommandLineAsyncIO(command, (stdout, stderr, exitCode) => {
            if (exitCode === 0) {
                this.settings.setValue(CONSERVATION_MODE, state);
                this._updateTooltip(state);
            } else {
                globalThis.logError(`Failed to write conservation_mode: ${stderr}`);
                this.menuItem.setToggleState(!state);
            }
        });
    },

    _onSettingsChanged: function() {
        let state = this.settings.getValue(CONSERVATION_MODE);
        let value = state ? "1" : "0";
        let command = `pkexec sh -c "echo '${value}' > ${FILE_PATH}"`;
        Util.spawnCommandLineAsyncIO(command);
        this.menuItem.setToggleState(state);
        this._updateTooltip(state);
    },

    _updateTooltip: function(state) {
        let status = state ? _("ON") : _("OFF");
        this.set_applet_tooltip(_("Battery Conservation Mode") + ": " + status);
    }
};

function main(metadata, orientation, panelHeight, instanceId) {
    return new MyApplet(metadata, orientation, panelHeight, instanceId);
}
