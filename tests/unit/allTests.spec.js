import { mount } from '@vue/test-utils';
const LibUtils = require("../../static/libraries/libUtils").default
import Button from '../../components/Button';
import ApiHelper from "../../static/libraries/ApiHelper";
import axios from "axios";

describe('Testing API', () => {
    const apiKey = 'hOjNh9CbqGgfNV8N7qawjcMchELLkL9X'

    let apiHelper = new ApiHelper(apiKey)

    it("API Key is setted", () => {
        expect(apiHelper.ApiKey).toBe(apiKey)
    })

    it("Can reach API", async () => {
        let endpoint = apiHelper.Endpoints.latest;
        let apiUrl = apiHelper.buildRequestUrl(endpoint);
        const response = await axios.get(apiUrl)
        expect(response.status).toBe(200);
    })

    it("Throws error if invalid endpoint", async () => {
        let endpoint = "/invalid"
        let apiUrl = apiHelper.buildRequestUrl(endpoint);
        const response = await axios.get(apiUrl).catch(er => null)
        expect(response).toBe(null);
    })
})

describe('Testing Component: Button', () => {
    const wrapper = mount(Button)

    wrapper.setProps({ caption: "Test Button" });

    it('Button has caption "Test Button"', () => {
        expect(wrapper.vm.caption).toBe("Test Button")
        expect(wrapper.html()).toContain("Test Button")
    })

    wrapper.setProps({ disabled: true });

    it('Disabled Button is really disabled', () => {
        let buttonElement = wrapper.element
        let classes = buttonElement.classList

        expect(wrapper.vm.isDisabled).toBe(true);
        expect(classes != null).toBe(true)
        if (classes != null) {
            expect(classes).toContain("disabled")
        } else {
            return false
        }
    })
})

describe('Testing LibUtils.js functions', () => {

    it('toDecimal returns 0 if invalid value is passed', () => {
        expect(LibUtils.toDecimal("a")).toBe(0)
    })

    it('toDecimal returns valid number if valid string number is passed', () => {
        expect(LibUtils.toDecimal("999")).toBe(999)
    })

    it('isFilled returns false if object with no keys is passed', () => {
        expect(LibUtils.isFilled({})).toBe(false)
    })

    it('isFilled returns true if array with single value is passed', () => {
        expect(LibUtils.isFilled([1])).toBe(true)
    })

    it('toBoolean returns true when passing 1 and false when passing 0', () => {
        expect(LibUtils.toBoolean(1)).toBe(true)
        expect(LibUtils.toBoolean(0)).toBe(false)
    })

})