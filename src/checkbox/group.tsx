import { defineComponent, h } from 'vue';
import intersection from 'lodash/intersection';
import { prefix } from '../config';
import Checkbox from './checkbox';
import checkboxGroupProps from './checkbox-group-props';
import { CheckboxOptionObj, TdCheckboxProps, CheckboxGroupValue } from './type';

const name = `${prefix}-checkbox-group`;

export default defineComponent({
  name,
  components: {
    Checkbox,
  },
  props: { ...checkboxGroupProps },
  emits: ['change'],

  data() {
    return {
      checkedMap: {},
    };
  },

  computed: {
    optionList(): Array<CheckboxOptionObj> {
      if (!this.options) return [];
      return this.options.map((item) => {
        let r: CheckboxOptionObj = {};
        if (typeof item !== 'object') {
          r = { label: String(item), value: item };
        } else {
          r = { ...item };
          r.disabled = r.disabled === undefined ? this.disabled : r.disabled;
        }
        return r;
      });
    },
    values(): string {
      if (this.value instanceof Array) {
        return this.value.join();
      }
      return '';
    },
    intersectionLen(): number {
      const values = this.optionList.map((item) => item.value);
      if (this.value instanceof Array) {
        const n = intersection(this.value, values);
        return n.length;
      }
      return 0;
    },
    isCheckAll(): boolean {
      if (this.value instanceof Array && this.value.length !== this.optionList.length - 1) {
        return false;
      }
      return this.intersectionLen === this.optionList.length - 1;
    },
    indeterminate(): boolean {
      return !this.isCheckAll && this.intersectionLen < this.optionList.length && this.intersectionLen !== 0;
    },
  },

  watch: {
    values: {
      immediate: true,
      handler() {
        if (this.value instanceof Array) {
          const map = {};
          this.value.forEach((item: string | number) => {
            map[item] = true;
          });
          this.checkedMap = map;
        }
      },
    },
  },

  methods: {
    renderCheckAll(option: CheckboxOptionObj) {
      return (
        <Checkbox
          checked={this.isCheckAll}
          indeterminate={this.indeterminate}
          onChange={this.onCheckAllChange}
          data-name="TDESIGN_CHECK_ALL"
          {...option}
        >
          {this.renderLabel(option)}
        </Checkbox>
      );
    },
    renderLabel(option: CheckboxOptionObj) {
      if (typeof option.label === 'function') {
        return option.label(h);
      }
      return option.label;
    },
    emitChange(val: CheckboxGroupValue, e?: Event) {
      this.$emit('change', val, { e });
    },
    handleCheckboxChange(data: { checked: boolean; e: Event; option: TdCheckboxProps }) {
      const oValue = data.option.value;
      if (this.value instanceof Array) {
        const val = [...this.value];
        if (data.checked) {
          val.push(oValue);
        } else {
          const i = val.indexOf(oValue);
          val.splice(i, 1);
        }
        this.emitChange(val, data.e);
      }
    },
    onCheckAllChange(checked: boolean, context: { e: Event }) {
      if (checked) {
        const val = [];
        for (let i = 0, len = this.optionList.length; i < len; i++) {
          const item = this.optionList[i];
          if (item.checkAll) continue;
          val.push(item.value);
          if (this.maxExceeded) break;
        }
        this.emitChange(val, context.e);
      } else {
        this.emitChange([], context.e);
      }
    },
  },

  render() {
    return (
      <div class={name} {...this.$attrs}>
        {!!this.optionList.length &&
          this.optionList.map((option, index) => {
            if (option.checkAll) return this.renderCheckAll(option);
            return (
              <Checkbox key={index} {...option} checked={this.checkedMap[option.value]}>
                {this.renderLabel(option)}
              </Checkbox>
            );
          })}
        {this.$slots.default && this.$slots.default(null)}
      </div>
    );
  },
});
