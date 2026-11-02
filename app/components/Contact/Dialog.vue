<script setup lang="ts">
const { open, closeContact } = useContact()

const form = reactive({ name: '', email: '', message: '' })
const token = ref('')
const turnstile = ref()
const loading = ref(false)
const sent = ref(false)
const errorMsg = ref('')
const nameInput = useTemplateRef<HTMLInputElement>('nameInput')

// The modal would otherwise focus its first control, the close button.
function focusName(event: Event) {
    if (!nameInput.value) return
    event.preventDefault()
    nameInput.value.focus()
}

const canSubmit = computed(() =>
    !!form.name.trim() && !!form.email.trim() && !!form.message.trim() && !!token.value && !loading.value)

async function submit() {
    if (!canSubmit.value) return
    loading.value = true
    errorMsg.value = ''
    try {
        await $fetch('/api/contact', { method: 'POST', body: { ...form, token: token.value } })
        sent.value = true
    } catch (e: any) {
        errorMsg.value = e?.data?.statusMessage || e?.statusMessage || 'Something went wrong. Please try again.'
        // Tokens are single-use — reset the widget so a retry gets a fresh one.
        token.value = ''
        turnstile.value?.reset?.()
    } finally {
        loading.value = false
    }
}

// Reset state each time the dialog is opened.
watch(open, (isOpen) => {
    if (isOpen) {
        sent.value = false
        errorMsg.value = ''
        Object.assign(form, { name: '', email: '', message: '' })
        token.value = ''
    }
})
</script>

<template>
    <UModal v-model:open="open" :content="{ onOpenAutoFocus: focusName }"
        :ui="{ overlay: 'bg-black/60 backdrop-blur-sm', content: 'w-full sm:max-w-md bg-transparent ring-0 shadow-none' }">
        <template #content>
            <div class="contact">
                <header class="contact-head">
                    <h2 class="contact-title">Send me a message</h2>
                    <button type="button" class="contact-close" aria-label="Close" @click="closeContact">
                        <UIcon name="i-ph-x" />
                    </button>
                </header>

                <div v-if="sent" class="contact-sent" role="status">
                    <UIcon name="i-ph-check-circle" class="contact-sent-icon" />
                    <p class="contact-title">Message sent</p>
                    <p>Thanks for reaching out. I'll get back to you soon.</p>
                    <button type="button" class="contact-button" @click="closeContact">Close</button>
                </div>

                <form v-else class="contact-form" @submit.prevent="submit">
                    <label class="contact-field">
                        <span>Name</span>
                        <input ref="nameInput" v-model="form.name" placeholder="Your name" autocomplete="name" required>
                    </label>
                    <label class="contact-field">
                        <span>Email</span>
                        <input v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" required>
                    </label>
                    <label class="contact-field">
                        <span>Message</span>
                        <textarea v-model="form.message" rows="4" placeholder="What's up?" required />
                    </label>

                    <NuxtTurnstile ref="turnstile" v-model="token" :options="{ theme: 'dark' }" />

                    <p v-if="errorMsg" class="contact-error" role="alert">
                        <UIcon name="i-ph-warning-circle" /> {{ errorMsg }}
                    </p>

                    <button type="submit" class="contact-button" :disabled="!canSubmit">
                        <UIcon v-if="loading" name="i-ph-circle-notch" class="animate-spin" />
                        <UIcon v-else name="i-ph-paper-plane-tilt" />
                        {{ loading ? 'Sending…' : 'Send message' }}
                    </button>
                </form>
            </div>
        </template>
    </UModal>
</template>

<style scoped>
/* The Discord bar's violet washing in from the corner, over the sheet's black. */
.contact {
    padding: 1.25rem;
    border: 1px solid var(--rule);
    border-radius: 8px;
    background: linear-gradient(160deg, rgb(91 63 124 / 0.35), transparent 60%), var(--black);
    box-shadow: 0 20px 60px rgb(0 0 0 / 0.5);
    color: var(--text);
    font-family: var(--font-karla);
    line-height: 1.5;
}

.contact-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.contact-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--cream);
}

.contact-close {
    display: flex;
    font-size: 1.1rem;
    color: var(--muted);
    transition: color 200ms;
}

.contact-close:hover {
    color: var(--cream);
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
}

.contact-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.contact-field > span {
    font-size: 0.8rem;
    color: var(--muted);
}

.contact-field :is(input, textarea) {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--rule);
    border-radius: 6px;
    background: var(--charcoal);
    color: var(--cream);
    transition: border-color 200ms, box-shadow 200ms;
}

.contact-field textarea {
    min-height: 6rem;
    resize: vertical;
}

.contact-field :is(input, textarea)::placeholder {
    color: rgb(252 246 237 / 0.4);
}

/* The border and a ring in gold stand in for the outline. */
.contact-field :is(input, textarea):focus {
    border-color: var(--gold);
    outline: none;
    box-shadow: 0 0 0 1px var(--gold);
}

.contact-error {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--orange);
}

.contact-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    background: var(--gold);
    color: var(--black);
    font-weight: 700;
    transition: background-color 200ms, color 200ms, filter 200ms;
}

.contact-button:not(:disabled):hover {
    filter: brightness(1.08);
}

.contact-button:disabled {
    background: var(--charcoal);
    color: var(--muted);
    cursor: not-allowed;
}

.contact-button:focus-visible,
.contact-close:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 2px;
}

.contact-sent {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0 0.25rem;
    text-align: center;
}

.contact-sent-icon {
    font-size: 2.5rem;
    color: var(--mint);
}

.contact-sent .contact-button {
    margin-top: 0.75rem;
}
</style>
