import styled from 'styled-components'

export const Root = styled.div`
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 10px 12px;
  font: var(--font-size-ui) / 1.45 var(--font-ui);
  color: #000;

  h1,
  h2,
  h3 {
    margin: 0.75em 0 0.35em;
    line-height: 1.2;
    font-weight: 700;
  }

  h1 {
    margin-top: 0;
    font-size: 1.15em;
  }

  h2 {
    font-size: 1.05em;
  }

  h3 {
    font-size: 1em;
  }

  p {
    margin: 0 0 0.65em;
  }

  ul,
  ol {
    margin: 0 0 0.65em;
    padding-left: 1.4em;
  }

  li {
    margin: 0.2em 0;
  }

  strong {
    font-weight: 700;
  }

  code {
    font: inherit;
    background: #e0e0e0;
    padding: 0 2px;
  }

  a {
    color: #000080;

    &:hover {
      color: #0000ff;
    }
  }

  hr {
    border: none;
    border-top: 1px solid #808080;
    margin: 0.75em 0;
  }

  table {
    border-collapse: collapse;
    margin: 0 0 0.65em;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #808080;
    padding: 4px 6px;
    text-align: left;
  }

  th {
    background: #c0c0c0;
    font-weight: 700;
  }
`
