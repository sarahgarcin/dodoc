<template>
  <Modal
    @close="$emit('close')"
    @submit="newChat"
    :read_only="read_only"
    :typeOfModal="'EditMeta'"
    :askBeforeClosingModal="askBeforeClosingModal"
    :is_loading="is_sending_content_to_server"
  >
    <template slot="header">
      <span class>{{ $t("create_a_chat") }}</span>
    </template>

    <template slot="sidebar">
      <!-- Human name -->
      <div class="margin-bottom-small">
        <label>{{ $t("chat_name") }}</label>
        <input type="text" v-model.trim="chatdata.name" required autofocus />
      </div>

      <div class="margin-bottom-small">
        <span class="switch switch-xs">
          <input
            type="checkbox"
            class="switch"
            id="pinnedswitch_editmedia"
            v-model="chatdata.pinned"
          />
          <label
            for="pinnedswitch_editmedia"
            :class="{ 'c-rouge': chatdata.pinned }"
          >
            {{ $t("pinned_to_the_top_of_the_list") }}
            <svg
              version="1.1"
              class="inline-svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
              x="0px"
              y="0px"
              width="78.5px"
              height="106.4px"
              viewBox="0 0 78.5 106.4"
              style="enable-background: new 0 0 78.5 106.4;"
              xml:space="preserve"
            >
              <polygon
                class="st0"
                points="60.4,29.7 78.5,7.3 78.5,7.3 12.7,7.3 12.7,52 78.5,52 78.5,52 	"
              />
              <polygon class="st0" points="9.6,106.4 0,106.4 0,2 9.6,0 " />
            </svg>
          </label>
        </span>
      </div>

      <!-- Author(s) -->
      <div class="margin-bottom-small">
        <label>
          <button
            type="button"
            class="button-nostyle text-uc button-triangle"
            :class="{ 'is--active': show_authors }"
            @click="show_authors = !show_authors"
          >
            {{ $t("participants") }}
          </button>
        </label>
        <div v-if="show_authors">
          <AuthorsInput :currentAuthors.sync="chatdata.authors" />
          <small>{{ $t("author_instructions") }}</small>
        </div>
      </div>

      <!-- Access control -->
      <div class="margin-bottom-small">
        <label>
          <button
            type="button"
            class="button-nostyle text-uc button-triangle"
            :class="{ 'is--active': show_access_control }"
            @click="show_access_control = !show_access_control"
          >
            {{ $t("manage_access") }}
          </button>
        </label>

        <div v-if="show_access_control">
          <EditAccessControl
            :editing_limited_to.sync="chatdata.editing_limited_to"
            :viewing_limited_to.sync="chatdata.viewing_limited_to"
            :can_have_password="false"
            :can_have_readonly="false"
            :authors.sync="chatdata.authors"
          />
        </div>
      </div>
    </template>

    <template slot="submit_button">{{ $t("create") }}</template>
  </Modal>
</template>
<script>
import AuthorsInput from "../subcomponents/AuthorsInput.vue";
import EditAccessControl from "../subcomponents/EditAccessControl.vue";

export default {
  props: {
    read_only: Boolean,
  },
  components: {
    AuthorsInput,
    EditAccessControl,
  },
  data() {
    return {
      show_authors: true,
      show_access_control: true,

      is_sending_content_to_server: false,

      chatdata: {
        name: "",
        pinned: false,
        authors: this.$root.current_author
          ? [{ slugFolderName: this.$root.current_author.slugFolderName }]
          : [],
        editing_limited_to: "everybody",
        viewing_limited_to: "everybody",
      },
      askBeforeClosingModal: false,
    };
  },
  watch: {
    "chatdata.name": function () {
      if (this.chatdata.name.length > 0) {
        this.askBeforeClosingModal = true;
      } else {
        this.askBeforeClosingModal = false;
      }
    },
    preview: function () {
      if (!!this.preview) {
        this.askBeforeClosingModal = true;
      } else {
        this.askBeforeClosingModal = false;
      }
    },
  },
  computed: {},
  methods: {
    newChat: function (event) {
      console.log("newChat");

      if (
        Object.values(this.$root.store.chats).some(
          ({ name }) => name === this.chatdata.name
        )
      ) {
        this.$alertify
          .closeLogOnClick(true)
          .delay(4000)
          .error(this.$t("notifications.name_already_exists"));

        return false;
      }

      this.is_sending_content_to_server = true;

      this.$root
        .createFolder({ type: "chats", data: this.chatdata })
        .then((cdata) => {
          this.$emit("close");
          this.$root.openChat(cdata.slugFolderName);
        });
    },
  },
};
</script>
<style></style>
