import React from "react";

import axios from "./axios.js";

import { render, waitForElement, fireEvent } from "@testing-library/react";

import BioEditor from "./BioEditor.js";

jest.mock("./axios.js");

axios.post.mockResolvedValue({
    data: {},
});

test("When no bio is passed to it, an Add button is rendered", async () => {
    const { container } = render(<BioEditor />);
    await waitForElement(() => container.querySelector(".edit-link"));
    expect(
        container.querySelector(".edit-link").innerHTML.toLowerCase()
    ).toContain("add");
});

test("When a bio is passed to it, an Edit button is rendered", async () => {
    const { container } = render(<BioEditor bio="mock-bio-text" />);
    await waitForElement(() => container.querySelector(".edit-link"));
    expect(
        container.querySelector(".edit-link").innerHTML.toLowerCase()
    ).toContain("edit");
});

test("Clicking the Edit button causes a textarea and a Save button to be rendered", async () => {
    const { container } = render(<BioEditor bio="mock-bio-text" />);
    await waitForElement(() => container.querySelector(".edit-link"));
    fireEvent.click(container.querySelector(".edit-link"));

    expect(container.querySelectorAll("input")[0].type).toBe("textarea");
    expect(container.querySelectorAll("button")[0].type).toBe("submit");
});

test("Clicking the Add button causes a textarea and a Save button to be rendered", async () => {
    const { container } = render(<BioEditor />);
    await waitForElement(() => container.querySelector(".edit-link"));
    fireEvent.click(container.querySelector(".edit-link"));

    expect(container.querySelectorAll("input")[0].type).toBe("textarea");
    expect(container.querySelectorAll("button")[0].type).toBe("submit");
});

test("Clicking the submit-button causes an ajax request.", async () => {
    axios.post.mockClear();
    const { container } = render(<BioEditor bio="mock-bio-text" />);
    await waitForElement(() => container.querySelector(".edit-link"));
    fireEvent.click(container.querySelector(".edit-link"));
    fireEvent.click(container.querySelector("[type=submit]"));

    expect(axios.post.mock.calls.length).toBe(1);
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called.", async () => {
    const updateBio = jest.fn(() => null);

    const { container } = render(
        <BioEditor bio="mock-bio-text" updateBio={updateBio} />
    );
    await waitForElement(() => container.querySelector(".edit-link"));
    fireEvent.click(container.querySelector(".edit-link"));
    fireEvent.submit(container.querySelector("form"));
    await waitForElement(() => container.querySelector(".edit-link"));

    expect(updateBio.mock.calls.length).toBe(1);
});
