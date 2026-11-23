export default defineAppConfig({
    ui: {
        colors: {
            primary: 'purple',
            neutral: 'slate'
        },
        prose: {
            // A wavy underline on hover instead of a straight border.
            a: {
                base: 'border-b-0 hover:underline hover:decoration-wavy hover:decoration-primary underline-offset-4',
            },
            // Code block tab icons by file extension; unmapped ones fall back to the uninstalled vscode-icons set.
            codeIcon: {
                container: 'i-simple-icons-podman',
            },
        },
    }
})
