import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Demo from '../pages/Demo';
import Cococ from '../pages/Cococ/index';  // パスを更新
import NotFound from '../pages/NotFound';

const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/cococ" element={<Cococ />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouteConfig;