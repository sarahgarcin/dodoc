<template>
  <span v-if="editing_limited_to && editing_limited_to !== 'everybody'">
    <svg
      v-if="is_protected"
      version="1.1"
      class="inline-svg"
      style="padding-top: 6px;"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="66.9px"
      height="88.3px"
      viewBox="0 0 66.9 88.3"
      xml:space="preserve"
      :content="popover_caption"
      v-tippy="{
        placement: 'bottom',
        delay: [600, 0],
      }"
    >
      <path
        style="fill: currentColor;"
        d="M61.7,34.4h-1V24.3c0-11.7-7.5-19.2-16.9-22.7C40.6,0.6,36.7,0,33.1,0C29.5,0,26,0.6,22.4,1.6
		C13.3,4.9,6.2,12.3,6.2,24.3v10.1h-1c-2.9,0-5.2,2.3-5.2,5.2v43.5c0,2.9,2.3,5.2,5.2,5.2h56.5c2.9,0,5.2-2.3,5.2-5.2V39.6
		C66.9,36.7,64.6,34.4,61.7,34.4z M33.4,70.1c-4.5,0-8.4-3.6-8.4-8.1c0-4.5,3.9-8.4,8.4-8.4s8.1,3.9,8.1,8.4
		C41.5,66.5,38,70.1,33.4,70.1z M49,34.4H17.9V24.3c0-6.2,3.6-10.1,8.4-11.7c2.3-0.6,4.5-1.3,6.8-1.3c2.3,0,4.9,0.6,6.8,1.3
		c5.2,1.6,9.1,5.8,9.1,11.7V34.4z"
      />
    </svg>
    <svg
      v-else
      class="inline-svg"
      style="padding-top: 6px;"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="100.3px"
      height="87.3px"
      viewBox="0 0 100.3 87.3"
      xml:space="preserve"
    >
      <path
        class="st1"
        d="M84.1,1.6C80.5,0.6,76.9,0,73.3,0c-3.6,0-7.5,0.6-10.7,1.6c-9.4,3.6-16.9,11-16.9,22.7v9.1H17.9H6.2h-1
				c-2.9,0-5.2,2.3-5.2,5.2v43.5c0,2.9,2.3,5.2,5.2,5.2h56.5c2.9,0,5.2-2.3,5.2-5.2V38.6c0-2.9-2.3-5.2-5.2-5.2h-1h-3.3v-9.1
				c0-5.8,3.9-10.1,9.1-11.7c1.9-0.6,4.5-1.3,6.8-1.3c2.3,0,4.5,0.6,6.8,1.3c4.9,1.6,8.4,5.5,8.4,11.7v10.7h11.7V24.3
				C100.3,12.3,93.1,4.9,84.1,1.6z M40.9,64.2c-0.3,0.7-0.7,1.4-1.2,2c-0.3,0.4-0.7,0.8-1.1,1.1c-0.4,0.3-0.8,0.6-1.3,0.9
				c-1.2,0.6-2.5,1-3.9,1s-2.8-0.3-4-1c-0.5-0.2-0.9-0.5-1.3-0.9c-0.4-0.3-0.8-0.7-1.2-1.1c-0.5-0.6-1-1.3-1.3-2
				c-0.4-1-0.7-2-0.7-3.2c0-1.4,0.4-2.8,1-4c0.3-0.5,0.6-0.9,0.9-1.3s0.7-0.8,1.2-1.2c0.4-0.3,0.9-0.7,1.3-0.9c1.2-0.7,2.6-1,4-1
				s2.7,0.4,3.9,1c0.5,0.3,0.9,0.6,1.3,0.9s0.8,0.7,1.1,1.2s0.6,0.9,0.9,1.3c0.6,1.2,1,2.6,1,4C41.5,62.1,41.3,63.2,40.9,64.2z"
      />
    </svg>
  </span>
</template>
<script>
export default {
  props: {
    editing_limited_to: String,
    is_protected: Boolean,
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    popover_caption() {
      if (this.editing_limited_to === "only_authors")
        return this.$t("protected_by_authors");
      if (this.editing_limited_to === "with_password")
        return this.$t("protected_by_pass");
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
