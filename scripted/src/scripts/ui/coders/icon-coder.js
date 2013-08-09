/**
 * @fileOverview Code values with icons.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

define([
    "lib/jquery",
    "../../exhibit-core",
    "../../util/localizer",
    "../../util/debug",
    "../../util/settings",
    "../ui-context",
    "./coder"
], function($, Exhibit, _, Debug, SettingsUtilities, UIContext, Coder) {
/**
 * @constructor
 * @class
 * @param {Element|jQuery} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
var IconCoder = function(containerElmt, uiContext) {
    $.extend(this, new Coder(
        "icon",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(IconCoder._settingSpecs);
    
    this._map = {};
    this._mixedCase = {
        "label": _("%coders.mixedCaseLabel"),
        "icon": null
    };
    this._missingCase = {
        "label": _("%coders.missingCaseLabel"),
        "icon": null
    };
    this._othersCase = {
        "label": _("%coders.othersCaseLabel"),
        "icon": null
    };

    this.register();
};

/**
 * @constant
 */
IconCoder._settingSpecs = {
};

/**
 * @constant
 */
IconCoder._iconTable = {
    // add built-in icons?
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.IconCoder}
 */
IconCoder.create = function(configuration, uiContext) {
    var coder, div;
    div = $("<div>")
        .hide()
        .appendTo("body");
    coder = new IconCoder(
        div,
        UIContext.create(configuration, uiContext)
    );
    
    IconCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.IconCoder}
 */
IconCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder;

    $(configElmt).hide();
    
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new IconCoder(
        configElmt,
        UIContext.create(configuration, uiContext)
    );
    
    SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    try {
        $(configElmt).children().each(function(index, elmt) {
            coder._addEntry(
                Exhibit.getAttribute(this,  "case"),
                $(this).text().trim(),
                Exhibit.getAttribute(this, "icon")
            );
        });
    } catch (e) {
        Debug.exception(e, _("%coders.error.configuration", "IconCoder"));
    }
    
    IconCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.IconCoder} coder
 * @param {Object} configuration
 */ 
IconCoder._configure = function(coder, configuration) {
    var entries, i;

    SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    if (typeof configuration.entries !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].icon);
        }
    }
};

/**
 *
 */
IconCoder.prototype.dispose = function() {
    this._map = null;
    this._dispose();
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {String} icon
 */
IconCoder.prototype._addEntry = function(kase, key, icon) {
    var entry;

    // used if there are built-in icons
    if (typeof IconCoder._iconTable[icon] !== "undefined") {
        icon = IconCoder._iconTable[icon];
    }
    
    entry = null;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "mixed":   entry = this._mixedCase; break;
    case "missing": entry = this._missingCase; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.icon = icon;
    } else {
        this._map[key] = { icon: icon };
    }
};

/**
 * @param {String} key
 * @param {Object} flags
 * @returns {String}
 */
IconCoder.prototype.translate = function(key, flags) {
    if (typeof this._map[key] !== "undefined") {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.keys.add(key);
        }
        return this._map[key].icon;
    } else if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.icon;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.others = true;
        }
        return this._othersCase.icon;
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @returns {String}
 */
IconCoder.prototype.translateSet = function(keys, flags) {
    var icon, self;
    icon = null;
    self = this;
    keys.visit(function(key) {
        var icon2 = self.translate(key, flags);
        if (icon === null) {
            icon = icon2;
        } else if (icon !== icon2) {
            if (typeof flags !== "undefined" && flags !== null) {
                flags.mixed = true;
            }
            icon = self._mixedCase.icon;
            return true;
        }
        return false;
    });
    
    if (icon !== null) {
        return icon;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.icon;
    }
};

/**
 * @returns {String}
 */
IconCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {String}
 */
IconCoder.prototype.getOthersIcon = function() {
    return this._othersCase.icon;
};

/**
 * @returns {String}
 */
IconCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {String}
 */
IconCoder.prototype.getMissingIcon = function() {
    return this._missingCase.icon;
};

/**
 * @returns {String}
 */
IconCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {String}
 */
IconCoder.prototype.getMixedIcon = function() {
    return this._mixedCase.icon;
};

    // end define
    return IconCoder;
});
