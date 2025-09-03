<template>
    <svg :width="props.width" height="52" viewBox="0 0 272 52" fill="none" xmlns="http://www.w3.org/2000/svg" class="filter-none">
        <g filter="url(#filter0_b_424_1527)">
            <g clip-path="url(#clip0_424_1527)">
                <rect width="50" height="50" rx="25" transform="matrix(1 0 0 -1 0 50)" fill="black"
                    fill-opacity="0.45"></rect>
            </g>
            <path
                d="M19.8115 15.4912H30.1885V14.999C30.1885 13.707 29.5527 13.0918 28.3223 13.0918H21.6777C20.4473 13.0918 19.8115 13.707 19.8115 14.999V15.4912ZM23.7695 36.0503H26.2305C27.4609 36.0503 28.0864 35.4351 28.0864 34.1431V23.2534C28.0864 22.1768 28.3428 21.3975 28.7324 20.8027L29.3989 19.8184C29.8706 19.0903 30.1885 18.4033 30.1885 17.5317V16.6909H19.8115V17.5317C19.8115 18.4033 20.1294 19.0903 20.6011 19.8184L21.2573 20.8027C21.6572 21.3975 21.9033 22.1768 21.9033 23.2534V34.1431C21.9033 35.4351 22.5391 36.0503 23.7695 36.0503ZM25 28.165C24.1592 28.165 23.6157 27.5498 23.6157 26.6885V23.8789C23.6157 23.0073 24.1592 22.4229 25 22.4434C25.8306 22.4536 26.3843 23.0381 26.3843 23.8789V26.6885C26.3843 27.5498 25.8306 28.165 25 28.165ZM25 27.437C25.4512 27.437 25.8408 27.0576 25.8408 26.5962C25.8408 26.1348 25.4512 25.7451 25 25.7451C24.5386 25.7451 24.1489 26.1348 24.1489 26.5962C24.1489 27.0576 24.5386 27.437 25 27.437Z"
                fill="#FFFFFF"></path>
        </g>
        <g filter="url(#filter1_b_424_1527)">
            <g clip-path="url(#clip1_424_1527)">
                <rect width="50" height="50" rx="25" transform="matrix(1 0 0 -1 222 50)" fill="black"
                    fill-opacity="0.45"></rect>
            </g>
            <path
                d="M247 20.8332C247 19.5311 245.881 18.4165 244.5 18.4165H242.417L241.583 17.0832C241.333 16.5207 240.75 16.1665 240.083 16.1665H233.917C233.25 16.1665 232.667 16.5207 232.417 17.0832L231.583 18.4165H229.5C228.119 18.4165 227 19.5311 227 20.8332V31.6665C227 32.9686 228.119 34.0832 229.5 34.0832H244.5C245.881 34.0832 247 32.9686 247 31.6665V20.8332ZM237 29.9998C234.239 29.9998 232 27.7613 232 24.9998C232 22.2384 234.239 19.9998 237 19.9998C239.761 19.9998 242 22.2384 242 24.9998C242 27.7613 239.761 29.9998 237 29.9998Z"
                fill="#FFFFFF"></path>
        </g>
        <defs>
            <filter id="filter0_b_424_1527" x="-135.914" y="-135.914" width="321.828" height="321.828"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_424_1527"></feComposite>
            </filter>
            <filter id="filter1_b_424_1527" x="86.0859" y="-135.914" width="321.828" height="321.828"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_424_1527"></feComposite>
            </filter>
            <clipPath id="clip0_424_1527">
                <rect width="50" height="50" transform="matrix(1 0 0 -1 0 50)">
                </rect>
            </clipPath>
            <clipPath id="clip1_424_1527">
                <rect width="50" height="50" transform="matrix(1 0 0 -1 222 50)">
                </rect>
            </clipPath>
        </defs>
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
});
</script>
