// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

function init() {
    Convenience.initTranslations();
}

const DarkLightSwitchSettings = new GObject.Class({
    Name: 'DarkLightSwitchPrefs',
    Extends: Gtk.Grid,

    _init: function(params) {

        this.parent(params);
        this.margin = 24;
        this.spacing = 30;
        this.row_spacing = 10;
        this._settings = Convenience.getSettings();

        let label = null
        let widget = null;
        let str = null;
        let positionSetting = null;
        let positionButton = null;
        let radio = null;

        label = new Gtk.Label({
            label: _('Light Background'),
            hexpand: true,
            halign: Gtk.Align.START
        });
        widget = new Gtk.FileChooserButton();
        widget.set_file(Gio.File.new_for_uri(this._settings.get_string('light-background')));
        widget.connect('file-set', Lang.bind(this, function(w){
             this._settings.set_string('light-background', w.get_file().get_uri());
        }));
        this.attach(label, 0, 1, 1, 1);
        this.attach(widget, 1, 1, 1, 1);
       

        label = new Gtk.Label({
            label: _('Dark Background'),
            hexpand: true,
            halign: Gtk.Align.START
        });
        widget = new Gtk.FileChooserButton();
        widget.set_file(Gio.File.new_for_uri(this._settings.get_string('dark-background')));
        widget.connect('file-set', Lang.bind(this, function(w){
             this._settings.set_string('dark-background', w.get_file().get_uri());
        }));
        this.attach(label, 0, 2, 1, 1);
        this.attach(widget, 1, 2, 1, 1);



        label = new Gtk.Label({
            label: _('Light Theme'),
            hexpand: true,
            halign: Gtk.Align.START
        });
        widget = new Gtk.Entry();
        str = this._settings.get_string('light-theme');
        widget.set_buffer(Gtk.EntryBuffer.new(str, str.length));
        widget.connect('changed', Lang.bind(this, function(w){
            str = w.get_buffer().get_text();
            this._settings.set_string('light-theme', str);
        }));
        this.attach(label, 0, 3, 1, 1);
        this.attach(widget, 1, 3, 1, 1);
       
        label = new Gtk.Label({
            label: _('Dark Theme'),
            hexpand: true,
            halign: Gtk.Align.START
        });
        widget = new Gtk.Entry();
        str = this._settings.get_string('dark-theme');
        widget.set_buffer(Gtk.EntryBuffer.new(str, str.length));
        widget.connect('changed', Lang.bind(this, function(w){
            str = w.get_buffer().get_text();
            this._settings.set_string('dark-theme', str);
        }));
        this.attach(label, 0, 4, 1, 1);
        this.attach(widget, 1, 4, 1, 1);
        
        
    },

});

function buildPrefsWidget() {
     let widget = new DarkLightSwitchSettings();
     widget.show_all();

     return widget;
}
