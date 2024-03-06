// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as LinearMemoryInspectorComponents from './components/components.js';
import { LinearMemoryInspectorController } from './LinearMemoryInspectorController.js';
const UIStrings = {
    /**
     *@description Label in the Linear Memory inspector tool that serves as a placeholder if no inspections are open (i.e. nothing to see here).
     *             Inspection hereby refers to viewing, navigating and understanding the memory through this tool.
     */
    noOpenInspections: 'No open inspections',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/LinearMemoryInspectorPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let inspectorInstance;
export class LinearMemoryInspectorPane extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    #tabbedPane;
    constructor() {
        super(false);
        this.element.setAttribute('jslog', `${VisualLogging.panel('linear-memory-inspector').track({ resize: true })}`);
        const placeholder = document.createElement('div');
        placeholder.textContent = i18nString(UIStrings.noOpenInspections);
        placeholder.style.display = 'flex';
        this.#tabbedPane = new UI.TabbedPane.TabbedPane();
        this.#tabbedPane.setPlaceholderElement(placeholder);
        this.#tabbedPane.setCloseableTabs(true);
        this.#tabbedPane.setAllowTabReorder(true, true);
        this.#tabbedPane.addEventListener(UI.TabbedPane.Events.TabClosed, this.#tabClosed, this);
        this.#tabbedPane.show(this.contentElement);
        this.#tabbedPane.headerElement().setAttribute('jslog', `${VisualLogging.toolbar()}`);
    }
    static instance() {
        if (!inspectorInstance) {
            inspectorInstance = new LinearMemoryInspectorPane();
        }
        return inspectorInstance;
    }
    #tabView(tabId) {
        const view = this.#tabbedPane.tabView(tabId);
        if (view === null) {
            throw new Error(`No linear memory inspector view for the given tab id: ${tabId}`);
        }
        return view;
    }
    create(tabId, title, arrayWrapper, address) {
        const inspectorView = new LinearMemoryInspectorView(arrayWrapper, address, tabId);
        this.#tabbedPane.appendTab(tabId, title, inspectorView, undefined, false, true);
        this.#tabbedPane.selectTab(tabId);
    }
    close(tabId) {
        this.#tabbedPane.closeTab(tabId, false);
    }
    reveal(tabId, address) {
        const view = this.#tabView(tabId);
        if (address !== undefined) {
            view.updateAddress(address);
        }
        this.refreshView(tabId);
        this.#tabbedPane.selectTab(tabId);
    }
    refreshView(tabId) {
        const view = this.#tabView(tabId);
        view.refreshData();
    }
    #tabClosed(event) {
        const { tabId } = event.data;
        this.dispatchEventToListeners("ViewClosed" /* Events.ViewClosed */, tabId);
    }
}
class LinearMemoryInspectorView extends UI.Widget.VBox {
    #memoryWrapper;
    #address;
    #tabId;
    #inspector;
    firstTimeOpen;
    constructor(memoryWrapper, address = 0, tabId) {
        super(false);
        if (address < 0 || address >= memoryWrapper.length()) {
            throw new Error('Requested address is out of bounds.');
        }
        this.#memoryWrapper = memoryWrapper;
        this.#address = address;
        this.#tabId = tabId;
        this.#inspector = new LinearMemoryInspectorComponents.LinearMemoryInspector.LinearMemoryInspector();
        this.#inspector.addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.MemoryRequestEvent.eventName, (event) => {
            this.#memoryRequested(event);
        });
        this.#inspector.addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.AddressChangedEvent.eventName, (event) => {
            this.updateAddress(event.data);
        });
        this.#inspector.addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.SettingsChangedEvent.eventName, (event) => {
            // Stop event from bubbling up, since no element further up needs the event.
            event.stopPropagation();
            this.saveSettings(event.data);
        });
        this.#inspector.addEventListener(LinearMemoryInspectorComponents.LinearMemoryHighlightChipList.DeleteMemoryHighlightEvent.eventName, (event) => {
            LinearMemoryInspectorController.instance().removeHighlight(this.#tabId, event.data);
            this.refreshData();
        });
        this.contentElement.appendChild(this.#inspector);
        this.firstTimeOpen = true;
    }
    wasShown() {
        this.refreshData();
    }
    saveSettings(settings) {
        LinearMemoryInspectorController.instance().saveSettings(settings);
    }
    updateAddress(address) {
        if (address < 0 || address >= this.#memoryWrapper.length()) {
            throw new Error('Requested address is out of bounds.');
        }
        this.#address = address;
    }
    refreshData() {
        void LinearMemoryInspectorController.getMemoryForAddress(this.#memoryWrapper, this.#address).then(({ memory, offset, }) => {
            let valueTypes;
            let valueTypeModes;
            let endianness;
            if (this.firstTimeOpen) {
                const settings = LinearMemoryInspectorController.instance().loadSettings();
                valueTypes = settings.valueTypes;
                valueTypeModes = settings.modes;
                endianness = settings.endianness;
                this.firstTimeOpen = false;
            }
            this.#inspector.data = {
                memory,
                address: this.#address,
                memoryOffset: offset,
                outerMemoryLength: this.#memoryWrapper.length(),
                valueTypes,
                valueTypeModes,
                endianness,
                highlightInfo: this.#getHighlightInfo(),
            };
        });
    }
    #memoryRequested(event) {
        const { start, end, address } = event.data;
        if (address < start || address >= end) {
            throw new Error('Requested address is out of bounds.');
        }
        void LinearMemoryInspectorController.getMemoryRange(this.#memoryWrapper, start, end).then(memory => {
            this.#inspector.data = {
                memory: memory,
                address: address,
                memoryOffset: start,
                outerMemoryLength: this.#memoryWrapper.length(),
                highlightInfo: this.#getHighlightInfo(),
            };
        });
    }
    #getHighlightInfo() {
        const highlightInfo = LinearMemoryInspectorController.instance().getHighlightInfo(this.#tabId);
        if (highlightInfo !== undefined) {
            if (highlightInfo.startAddress < 0 || highlightInfo.startAddress >= this.#memoryWrapper.length()) {
                throw new Error('HighlightInfo start address is out of bounds.');
            }
            if (highlightInfo.size <= 0) {
                throw new Error('Highlight size must be a positive number.');
            }
        }
        return highlightInfo;
    }
}
//# sourceMappingURL=LinearMemoryInspectorPane.js.map