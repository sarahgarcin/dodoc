<template>
  <div
    class="m_mediaStory"
    :class="[
      'type-' + media.type,
      {
        'is--selected': is_selected,
        'is--previewed': preview_mode,
        'has--onlyNumbers': media.only_numbers,
      },
    ]"
    ref="media"
    @mouseover="mouseOver"
    @mouseleave="mouseLeave"
    @click.stop="selectMedia"
  >
    <template v-if="media.hasOwnProperty('_linked_media')">
      <div v-if="media._linked_media.hasOwnProperty('_isAbsent')">
        {{ $t("linked_media_wasnt_found") }}
        <br />
        <small>
          {{ media._linked_media.slugProjectName }}/{{
            media._linked_media.slugMediaName
          }}
        </small>
      </div>
      <MediaContent
        v-else
        :context="'full'"
        :slugFolderName="media._linked_media.slugProjectName"
        :media="media._linked_media"
        :read_only="read_only"
        :style="mediaStyles"
        v-model="media._linked_media.content"
      />
    </template>

    <template v-else>
      <!-- if not -->
      <MediaContent
        v-if="
          [
            'image',
            'video',
            'audio',
            'code',
            'stl',
            'document',
            'other',
          ].includes(media.type)
        "
        :context="'full'"
        :slugFolderName="slugPubliName"
        :folderType="'publications'"
        :media="media"
        :read_only="read_only"
        :style="mediaStyles"
        v-model="media.content"
      />

      <div class="mediaContainer" v-else :class="`type-${media.type}`">
        <template v-if="media.type === 'text'">
          <template
            v-if="
              inline_edit_mode && is_selected && !preview_mode && !read_only
            "
          >
            <template v-if="media.only_numbers">
              <input
                type="number"
                v-model="htmlForEditor"
                @input="updateTextMedia"
              />
            </template>

            <CollaborativeEditor
              v-else
              v-model="htmlForEditor"
              :specific_toolbar="media.plain_text ? [] : undefined"
              :media="media"
              :slugFolderName="slugPubliName"
              :enable_collaboration="true"
              :type="'publications'"
              :style="force_text_style"
              ref="textField"
            />
          </template>
          <!-- class="fixedPanel"
          :theme="'bubble'"-->

          <div v-else class="mediaTextContent">
            <div v-if="htmlForEditor.length !== 0" v-html="htmlForEditor" />
            <p v-else class="_no_textcontent" v-html="no_text_content" />
          </div>
        </template>
        <template v-else-if="media.type === 'placeholder'">
          <div class="_placeholder">
            <!-- <label>{{ $t("placeholder") }} </label> -->
            <div class="_placeholder--instructions">
              <label>{{ $t("instructions") }}</label>

              <MediaField
                :value="media.instructions"
                :show_edit_button="true"
                :add_instructions="$t('add_instructions')"
                :edit_instructions="$t('edit_instructions')"
                :read_only="preview_mode || read_only"
                @updateField="
                  (value) => updateMediaPubliMeta({ instructions: value })
                "
              />
              <div class="margin-vert-small">
                <span class="switch switch-xs">
                  <input
                    type="checkbox"
                    class="switch"
                    :id="`hide_instructions_when_fulfilled_${id}`"
                    v-model="hide_instructions_when_fulfilled"
                  />
                  <label
                    :for="`hide_instructions_when_fulfilled_${id}`"
                    :class="{ 'c-rouge': hide_instructions_when_fulfilled }"
                  >
                    {{ $t("hide_instructions_when_fulfilled") }}
                  </label>
                </span>
              </div>
            </div>
            <div class="_placeholder--constraints">
              <label v-html="$t('type_of_expected_contents:')" />

              <PlaceholderConstraints
                :available_modes="media.available_modes"
                :read_only="preview_mode || read_only"
                @updateField="
                  (value) => updateMediaPubliMeta({ available_modes: value })
                "
              />
            </div>
          </div>
        </template>
        <template v-else-if="media.type === 'divider'">
          <div class="mediaTextContent">
            <hr />
          </div>
        </template>
      </div>
    </template>

    <MediaField
      v-if="
        (media.caption || is_selected) &&
        media.type !== 'text' &&
        media.type !== 'placeholder' &&
        media.type !== 'divider'
      "
      class="mediaCaption"
      :value="media.caption"
      :add_instructions="$t('add_caption')"
      :edit_instructions="$t('edit_caption')"
      :show_edit_button="is_selected"
      :read_only="preview_mode || read_only"
      @updateField="(value) => updateMediaPubliMeta({ caption: value })"
    />

    <div
      class="m_mediaStory--moveItemButtons"
      :class="{
        'is--visible':
          !preview_mode && !read_only && (is_selected || is_hovered),
      }"
    >
      <button
        type="button"
        class="m_mediaStory--moveItemButtons--before"
        :disabled="media_position === 'first' || media_position === 'alone'"
        @click.stop="
          $emit('changeMediaOrder', {
            metaFileName: media.metaFileName,
            dir: -1,
          })
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168">
          <path
            d="M87.46,49.46,73.39,64.77a65.3,65.3,0,0,1-6.15,6.15A47.8,47.8,0,0,1,61,75.29H131.6V91.14H61A39.1,39.1,0,0,1,67,95.51q2.81,2.46,6.36,6.15L87.46,117,74.48,128,34.17,83.21,74.48,38.39Z"
            style="fill: currentColor"
          />
        </svg>
      </button>

      <div class="m_mediaStory--moveItemButtons--options">
        <button
          type="button"
          @click.stop="
            show_advanced_menu = !show_advanced_menu;
            selectMedia();
          "
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="4px"
            height="16.2px"
            viewBox="0 0 4 16.2"
            style="enable-background: new 0 0 4 16.2"
            xml:space="preserve"
          >
            <path
              style="fill: currentColor"
              d="M0,14.1c0,1.1,0.9,2,2,2s2-0.9,2-2s-0.9-2-2-2S0,13,0,14.1z M0,2c0,1.1,0.9,2,2,2s2-0.9,2-2S3.1,0,2,0
	S0,0.9,0,2z M0,8.1c0,1.1,0.9,2,2,2s2-0.9,2-2s-0.9-2-2-2S0,7,0,8.1z"
            />
          </svg>
        </button>
        <div class="_advanced_menu" v-if="show_advanced_menu">
          <button
            type="button"
            class="buttonLink"
            @click="duplicateMedia"
            v-if="can_duplicate_media"
          >
            <svg
              version="1.1"
              class="inline-svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="91.6px"
              height="95px"
              viewBox="0 0 91.6 95"
              style="enable-background: new 0 0 91.6 95"
              xml:space="preserve"
            >
              <polygon
                class="st0"
                points="39.5,11.8 83,11.8 83,55.4 72.7,55.4 72.7,67.2 94.8,67.2 94.8,0 27.7,0 27.7,22.2 39.5,22.2 	"
              />
              <path
                class="st0"
                d="M67.2,27.7L0,27.7l0,67.2l67.2,0L67.2,27.7z M55.4,83l-43.6,0l0-43.6l43.6,0L55.4,83z"
              />
            </svg>
            <span class>{{ $t("duplicate") }}</span>
          </button>

          <a
            v-if="media.type !== 'text'"
            :download="media.media_filename"
            :href="mediaURL"
            target="_blank"
            class="buttonLink"
            :disabled="read_only"
          >
            <svg
              version="1.1"
              class="inline-svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="46.7px"
              height="70px"
              viewBox="0 0 46.7 70"
              style="enable-background: new 0 0 46.7 70"
              xml:space="preserve"
            >
              <g>
                <g>
                  <path
                    class="st0"
                    d="M8.5,35.2l4.6,4.2c2.7,2.5,4.8,4.7,6.4,7.3l0-46.7h7.7l0,46.6c1.7-2.5,3.8-4.7,6.4-7.1l4.6-4.2l5.3,6.2
			L23.3,59.6L3.2,41.5L8.5,35.2z"
                  />
                </g>
                <polygon class="st0" points="46.7,70 0,70 0,62.4 46.6,62.4 	" />
              </g>
            </svg>
            {{ $t("download") }}
          </a>

          <button
            type="button"
            v-if="media.hasOwnProperty('_linked_media')"
            class="buttonLink _no_underline"
            @mousedown.stop.prevent="editButtonClicked"
            @touchstart.stop.prevent="editButtonClicked"
            :content="$t('edit_original_media')"
            v-tippy="{
              placement: 'top',
              delay: [600, 0],
            }"
          >
            <svg
              version="1.1"
              class="inline-svg inline-svg-larger"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="113.5px"
              height="113.5px"
              viewBox="0 0 113.5 113.5"
              style="enable-background: new 0 0 113.5 113.5"
              xml:space="preserve"
            >
              <path
                d="M8.9,104.6c11.8,11.8,31,11.8,42.8,0l16.9-16.9c-1.3,0.1-2.7,0.2-4,0.2c-4.3,0-8.4-0.7-12.4-2l-9.6,9.6
		c-3.3,3.3-7.7,5.1-12.3,5.1c-4.6,0-9-1.8-12.3-5.1c-3.3-3.3-5.1-7.6-5.1-12.3c0-4.6,1.8-9,5.1-12.3l18.7-18.7
		c3.3-3.3,7.7-5.1,12.3-5.1c4.7,0,9,1.8,12.3,5.1c1.6,1.6,2.8,3.4,3.7,5.5c2.1-0.1,10.6-7.5,10.6-7.5c-1.4-2.5-3.1-4.9-5.3-7.1
		c-11.8-11.8-31-11.8-42.8,0L8.9,61.8C-3,73.6-3,92.8,8.9,104.6z"
              />
              <path
                d="M48.8,25.5c4.3,0,8.5,0.7,12.5,2.1l9.6-9.6c3.3-3.3,7.7-5.1,12.3-5.1s9,1.8,12.3,5.1c3.3,3.3,5.1,7.7,5.1,12.3
		s-1.8,9-5.1,12.3L76.8,61.3c-3.3,3.3-7.7,5.1-12.3,5.1c-4.7,0-9-1.8-12.3-5.1c-1.6-1.6-2.9-3.5-3.7-5.5c-2.1,0.1-4.1,1-5.7,2.5
		l-5,5c1.4,2.5,3.1,4.9,5.3,7.1c11.8,11.8,31,11.8,42.8,0l18.7-18.7c11.8-11.8,11.8-31,0-42.8C92.8-3,73.7-3,61.8,8.9L45,25.7
		C46.2,25.6,47.5,25.5,48.8,25.5L48.8,25.5L48.8,25.5z"
              />
            </svg>
            <!-- {{ $t('edit') }} -->
          </button>

          <!-- <button
            v-if="!!media.ratio && !lock_original_ratio"
            type="button"
            class="buttonLink _no_underline"
            @click.stop.prevent="toggleImageFitMode"
            :content="$t('switch_fit_mode')"
            v-tippy="{
              placement: 'top',
              delay: [600, 0],
            }"
          >
            <svg
              class="inline-svg inline-svg-larger"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="130.4px"
              height="130.4px"
              viewBox="0 0 130.4 130.4"
              style="enable-background: new 0 0 130.4 130.4;"
              xml:space="preserve"
            >
              <defs />
              <g>
                <path
                  d="M100.3,130.4H30.1c-2.4,0-4.4-2.2-4.4-5V5c0-2.8,2-5,4.4-5h70.1c2.4,0,4.4,2.2,4.4,5v120.4
		C104.7,128.2,102.7,130.4,100.3,130.4z M34.5,120.4h61.3V10H34.5V120.4z"
                />
              </g>
              <g>
                <path
                  d="M125.4,106.4h-12v-9.2h7v-6.4h10v11C130.4,104.3,128.2,106.4,125.4,106.4z"
                />
                <path
                  d="M93.8,106.4H75v-9.2h18.8V106.4z M55.4,106.4H36.6v-9.2h18.8V106.4z"
                />
                <path d="M17,106.4H5c-2.8,0-5-2.1-5-4.6v-11h10v6.4h7V106.4z" />
                <rect y="56.9" width="10" height="16.6" />
                <path d="M10,39.6H0v-11C0,26.1,2.2,24,5,24h12v9.2h-7V39.6z" />
                <path
                  d="M93.8,33.2H75V24h18.8V33.2z M55.4,33.2H36.6V24h18.8V33.2z"
                />
                <path
                  d="M130.4,39.6h-10v-6.4h-7V24h12c2.8,0,5,2.1,5,4.6V39.6z"
                />
                <rect x="120.4" y="56.9" width="10" height="16.6" />
              </g>
            </svg>
          </button>-->

          <button
            type="button"
            class="buttonLink _no_underline"
            @click.stop.prevent="removePubliMedia()"
          >
            <svg
              version="1.1"
              class="inline-svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="37.2px"
              height="37.2px"
              viewBox="0 0 37.2 37.2"
              style="enable-background: new 0 0 37.2 37.2"
              xml:space="preserve"
            >
              <polygon
                class="st0"
                points="37.2,30.6 30.6,37.2 18.6,25.2 6.6,37.2 0,30.6 12,18.6 0,6.6 6.6,0 18.6,12 30.6,0 37.2,6.6 
            25.2,18.6 "
              />
            </svg>
            {{
              media.hasOwnProperty("_linked_media")
                ? $t("withdraw")
                : $t("remove")
            }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="m_mediaStory--moveItemButtons--after"
        :disabled="media_position === 'last' || media_position === 'alone'"
        @click.stop="
          $emit('changeMediaOrder', {
            metaFileName: media.metaFileName,
            dir: +1,
          })
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168">
          <path
            d="M78.31,117l14.07-15.31a65.3,65.3,0,0,1,6.15-6.15,47.52,47.52,0,0,1,6.29-4.37H34.17V75.29h70.65a39.1,39.1,0,0,1-6.08-4.37q-2.8-2.46-6.36-6.15L78.31,49.46l13-11.07L131.6,83.21,91.29,128Z"
            style="fill: currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
import MediaContent from "./MediaContent.vue";
import debounce from "debounce";
import CollaborativeEditor from "./CollaborativeEditor.vue";
import MediaField from "./MediaField.vue";
import PlaceholderConstraints from "./PlaceholderConstraints.vue";

export default {
  props: {
    media: Object,
    read_only: Boolean,
    preview_mode: Boolean,
    slugPubliName: String,
    media_position: String,
    can_duplicate_media: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    MediaContent,
    CollaborativeEditor,
    MediaField,
    PlaceholderConstraints,
  },
  data() {
    return {
      is_dragged: false,
      is_resized: false,
      is_rotated: false,
      is_waitingForServer: false,
      is_hovered: false,
      is_touch: Modernizr.touchevents,

      inline_edit_mode: true,
      show_advanced_menu: false,

      htmlForEditor: this.media.content ? this.media.content : "",
      id: (Math.random().toString(36) + "00000000000000000").slice(2, 3 + 5),

      fit_mode: "cover",

      edit_instructions: false,
      new_instructions: "",

      debounce_textUpdate: undefined,
    };
  },

  created() {},
  mounted() {
    this.updateMediaStyles();
    this.$eventHub.$on("publication.selectNewMedia", this.selectNewMedia);
    this.$eventHub.$on(
      "publication.set_media_to_edit_mode",
      this.setMediaToEditMode
    );
    this.$eventHub.$on(
      "publication.just_inserted_media",
      this.mediaJustInserted
    );
  },
  beforeDestroy() {
    this.$eventHub.$off("publication.selectNewMedia", this.selectNewMedia);
    this.$eventHub.$off(
      "publication.just_inserted_media",
      this.mediaJustInserted
    );
  },

  watch: {
    media: {
      handler: function () {
        this.updateMediaStyles();
        this.htmlForEditor = this.media.content ? this.media.content : "";
      },
      deep: true,
    },
    edit_instructions() {
      if (this.edit_instructions) {
        this.new_instructions = this.media.instructions;
      }
    },
    is_selected() {},
  },
  computed: {
    hide_instructions_when_fulfilled: {
      get() {
        return this.media &&
          this.media.hasOwnProperty("hide_instructions_when_fulfilled") &&
          this.media.hide_instructions_when_fulfilled === true
          ? true
          : false;
      },
      set(value) {
        this.updateMediaPubliMeta({ hide_instructions_when_fulfilled: value });
      },
    },
    mediaURL() {
      const type_path = this.media._linked_media ? "" : "/_publications";
      const slugFolderName =
        this.media._linked_media && this.media._linked_media.slugProjectName
          ? this.media._linked_media.slugProjectName
          : this.slugPubliName;
      const media_filename =
        this.media._linked_media && this.media._linked_media.media_filename
          ? this.media._linked_media.media_filename
          : this.media.media_filename;
      return `${type_path}/${slugFolderName}/${media_filename}`;
    },
    force_text_style() {
      if (this.media.force_text_style === "bold") return `font-weight: 700;`;
      if (this.media.force_text_style === "italic")
        return `font-style: italic;`;
      if (this.media.force_text_style === "large") return `font-size: 200%;`;
      if (this.media.force_text_style === "small") return `font-size: 60%;`;
      return ``;
    },
    no_text_content() {
      if (this.media.only_numbers) return this.$t("no_numbers");
      return this.$t("no_text_content");
    },
    is_selected() {
      if (this.read_only) return false;
      const is_selected = this.$root.settings.current_publication.selected_medias.some(
        (meta) => meta === this.media.metaFileName
      );
      if (!is_selected) this.show_advanced_menu = false;
      return is_selected;
    },
    mediaStyles() {
      let css = "";

      const ratio = this.$root.getFileMeta({ type: "ratio", media: this.media })
        ? this.$root.getFileMeta({ type: "ratio", media: this.media })
        : 0.5625;
      css += `--media-ratio: ${ratio * 100}%; `;

      return css;
    },
  },
  methods: {
    duplicateMedia() {
      this.$emit("duplicateMedia", {
        metaFileName: this.media.metaFileName,
      });
    },
    selectNewMedia(metaFileName) {
      if (metaFileName === this.media.metaFileName)
        if (!this.is_selected) this.selectMedia();
    },
    setMediaToEditMode(metaFileName) {
      if (metaFileName === this.media.metaFileName) {
        if (!this.is_selected) this.selectMedia();
        this.editButtonClicked();
      }
    },
    mediaJustInserted(metaFileName) {
      if (this.media.metaFileName === metaFileName) {
        this.selectMedia();
        this.$nextTick(() => {
          this.scrollToMedia();
        });
      }
    },
    editButtonClicked() {
      if (this.media.hasOwnProperty("_linked_media"))
        this.$root.openMedia({
          slugProjectName: this.media._linked_media.slugProjectName,
          metaFileName: this.media._linked_media.metaFileName,
        });
    },
    toggleImageFitMode() {
      if (this.fit_mode === "cover") this.fit_mode = "contain";
      else if (this.fit_mode === "contain") this.fit_mode = "cover";

      this.updateMediaPubliMeta({
        fit_mode: this.fit_mode,
      });
    },

    updateMediaStyles() {
      this.fit_mode = this.media.hasOwnProperty("fit_mode")
        ? this.media.fit_mode
        : "cover";
    },
    updateMediaPubliMeta(val) {
      if (this.$root.state.dev_mode === "debug")
        console.log(`METHODS • MediaStory: updateMediaPubliMeta`);

      this.$emit("editPubliMedia", {
        metaFileName: this.media.metaFileName,
        val,
      });
    },
    updateTextMedia() {
      if (this.debounce_textUpdate) clearTimeout(this.debounce_textUpdate);
      this.debounce_textUpdate = setTimeout(() => {
        console.log(
          `CollaborativeEditor • updateTextMedia: saving new snapshop`
        );

        this.updateMediaPubliMeta({ content: this.htmlForEditor });
      }, 1000);
    },
    removePubliMedia() {
      if (this.media.type !== "placeholder") {
        this.$emit("removePubliMedia", {
          metaFileName: this.media.metaFileName,
        });
      } else {
        this.$alertify
          .okBtn(this.$t("yes"))
          .cancelBtn(this.$t("cancel"))
          .confirm(
            this.$t("sureToRemovePlaceholder"),
            () => {
              this.$emit("removePubliMedia", {
                metaFileName: this.media.metaFileName,
              });
            },
            () => {}
          );
      }
    },
    toggleMediaSelection() {
      if (this.is_selected) this.deselectMedia();
      else this.selectMedia();
    },
    selectMedia() {
      if (this.is_selected) return;

      if (this.$root.state.dev_mode === "debug")
        console.log(`METHODS • MediaStory: deselectMedia`);

      // if shift is not hold down
      // then we unselect everything
      this.$root.settings.current_publication.selected_medias = [];

      this.$root.settings.current_publication.selected_medias.push(
        this.media.metaFileName
      );
    },
    deselectMedia() {
      if (this.$root.state.dev_mode === "debug")
        console.log(`METHODS • MediaStory: deselectMedia`);

      this.show_advanced_menu = false;

      this.$root.settings.current_publication.selected_medias = this.$root.settings.current_publication.selected_medias.filter(
        (meta) => meta !== this.media.metaFileName
      );
    },
    scrollToMedia() {
      const media = this.$refs.media;
      if (media.scrollIntoViewIfNeeded) media.scrollIntoViewIfNeeded(true);
      else
        media.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
    },
    mouseOver() {
      if (!this.is_touch) {
        this.is_hovered = true;
      }
    },
    mouseLeave() {
      if (!this.is_touch) {
        this.is_hovered = false;
      }
    },
  },
};
</script>
