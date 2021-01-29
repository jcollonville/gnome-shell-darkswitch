const {GObject}      = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me             = ExtensionUtils.getCurrentExtension();
const Convenience    = Me.imports.convenience;
const Main           = imports.ui.main;
const PopupMenu     = imports.ui.popupMenu;
const Gio           = imports.gi.Gio;
const Lang          = imports.lang;
const PanelMenu = imports.ui.panelMenu;


var DSInstance = class DSInstance  {

    constructor() {
        this._aggregateMenu = Main.panel.statusArea.aggregateMenu;

        this._aggregateLayout = this._aggregateMenu.menu.box.get_layout_manager();
        this._theme_settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
        this._wp_settings = new Gio.Settings({ schema: 'org.gnome.desktop.background' });

        this._settings = Convenience.getSettings();
        this._settings.connect('changed::light-background', this._setBackground.bind(this));
        this._settings.connect('changed::dark-background', this._setBackground.bind(this));
        this._settings.connect('changed::light-theme', this._setTheme.bind(this));
        this._settings.connect('changed::dark-theme', this._setTheme.bind(this));

        this._isDark=this._settings.get_boolean('dark');
        this._setBackground();
        this._setTheme();

        this._menuItem = new PopupMenu.PopupImageMenuItem('loading...', 'display-brightness-symbolic');

        let menuItems = this._aggregateMenu.menu._getMenuItems();
        let i = 0;
        for (; i < menuItems.length; i++) {
            if (menuItems[i] === this._aggregateMenu._nightLight.menu) {
                break;
            }
        }
        this._aggregateMenu.menu.addMenuItem(this._menuItem, ++i);
        this._menuItem.connect('activate', this._toggle.bind(this));
        this._setMenuItem();
    }


    _setBackground() {
        let value = null;
        if (this._isDark === true) {
            value = this._settings.get_string('dark-background');
        } else {
            value = this._settings.get_string('light-background');
        }

        if ( value && value.length) {
            this._wp_settings.set_string('picture-uri', value);
        }
    }

    _setTheme() {
        let value = null;

        if (this._isDark === true) {
            value = this._settings.get_string('dark-theme');
        } else {
            value = this._settings.get_string('light-theme');
        }

        if ( value && value.length ) {
            this._theme_settings.set_string('gtk-theme', value);
        }

    }

    _setMenuItem() {
        if (this._isDark === true) {
            this._menuItem.label.text = 'Switch to Day mode';
            // this._menuItem.setIcon('weather-clear-symbolic'); 

        } else {
            this._menuItem.label.text = 'Switch to Night mode';
            // this._menuItem.setIcon('weather-clear-night-symbolic'); 
        }
    }


    _toggle() {        
            Main.overview.hide();
            this._isDark = !this._isDark;
            this._settings.set_boolean('dark', this._isDark);
            this._setTheme();
            this._setBackground();
            this._setMenuItem();
        }
    
   

    destroy() {
        this._menuItem.destroy();
    }
};


var DarkModeSwitch;
function init() {
}

function enable() {
    DarkModeSwitch = new DSInstance();
}

function disable() {
    DarkModeSwitch.destroy();
}


 
