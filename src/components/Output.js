import React from 'react';
import Terminal, { TerminalOutput } from 'react-terminal-ui';
import { Spin } from 'antd';

const Output = ({ isLoading, output, isError }) => {
  return (
    <Terminal name='Output Area' colorMode="dark">
      {isLoading ? (
        <TerminalOutput>
          <Spin size='large' />
        </TerminalOutput>
      ) : output ? (
        output.map((line, i) => (
          <TerminalOutput key={i}>
            <span style={{ color: isError ? 'red' : 'white' }}> {'>'} {'>'} {'>'} {line}</span>
          </TerminalOutput>
        ))
      ) : (
        <TerminalOutput>Click "Run Code" to see the output here</TerminalOutput>
      )}
    </Terminal>
  );
};

export default Output;
